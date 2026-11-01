'use strict';

/*
 * Generates the parameter selection of the admin (one select per section, see rct.configSections) from
 * rct.cmdReverse and keeps the corresponding native attributes rct_elements_<section> in io-package.json in sync,
 * so the admin always offers exactly the parameters the decoder knows.
 *
 *   node tasks/build-admin-options.js          update admin/jsonConfig.json and io-package.json
 *   node tasks/build-admin-options.js --check  exit 1 if one of the files is outdated
 */

const fs = require('node:fs');
const path = require('node:path');
const rct = require('../rct/rct.js');

const CONFIG_FILE = path.join(__dirname, '..', 'admin', 'jsonConfig.json');
const PACKAGE_FILE = path.join(__dirname, '..', 'io-package.json');
const silentInstance = { log: { warn() {}, info() {}, debug() {} } };

const SECTION_LABELS = {
    battery_cells: 'battery – cells',
    battery_modules: 'battery – modules',
    other: 'Other areas',
};

const I18N_DIR = path.join(__dirname, '..', 'admin', 'i18n');
const translations = Object.fromEntries(
    fs
        .readdirSync(I18N_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => [path.basename(f, '.json'), JSON.parse(fs.readFileSync(path.join(I18N_DIR, f), 'utf8'))]),
);

// label with number of parameters, e.g. "g_sync (47)"; translated labels as multilingual object,
// as admin translates a label only as a whole
function sectionLabel(section, count) {
    const base = SECTION_LABELS[section];
    if (!base) {
        return `${section} (${count})`;
    }
    return Object.fromEntries(Object.entries(translations).map(([lang, t]) => [lang, `${t[base] || base} (${count})`]));
}

const byName = (a, b) => a.label.localeCompare(b.label, 'en', { numeric: true });

function toOption(entry) {
    const unit = (entry.unit || '').trim();
    const description = [entry.description, unit && `[${unit}]`].filter(Boolean).join(' ');
    const option = { label: entry.name, value: entry.name };
    if (description) {
        option.description = description;
    }
    return option;
}

// option groups: battery modules by module index, "other" by channel, all other sections flat
function groupKey(section, name) {
    if (section === 'battery_cells' || section === 'battery_modules') {
        return { label: `Module ${name.match(/\[(\d+)\]/)[1]}` };
    }
    if (section === 'other') {
        return { label: rct.getStateInfo(name, silentInstance).channelName, noTranslation: true };
    }
    return null;
}

function buildSections() {
    const sections = Object.fromEntries(rct.configSections.map(s => [s, { flat: [], groups: {} }]));
    for (const entry of Object.values(rct.cmdReverse)) {
        const section = rct.getConfigSection(entry.name);
        const group = groupKey(section, entry.name);
        if (group) {
            const g = (sections[section].groups[group.label] = sections[section].groups[group.label] || {
                ...group,
                items: [],
            });
            g.items.push(toOption(entry));
        } else {
            sections[section].flat.push(toOption(entry));
        }
    }

    const items = {};
    for (const section of rct.configSections) {
        const { flat, groups } = sections[section];
        const options = [
            ...flat.sort(byName),
            ...Object.values(groups)
                .sort(byName)
                .map(g => ({ ...g, items: g.items.sort(byName) })),
        ];
        items[`rct_elements_${section}`] = {
            type: 'select',
            multiple: true,
            noTranslation: true,
            xs: 12,
            sm: 12,
            md: 6,
            lg: 4,
            xl: 4,
            label: sectionLabel(section, flat.length + Object.values(groups).reduce((n, g) => n + g.items.length, 0)),
            options,
        };
    }
    return items;
}

// native.rct_elements_<section>: keep existing selection, move entries into their section, drop stale keys
function buildNative(native) {
    const selected = Object.keys(native)
        .filter(k => k.startsWith('rct_elements'))
        .flatMap(k => (Array.isArray(native[k]) ? native[k] : []));
    const result = Object.fromEntries(Object.entries(native).filter(([k]) => !k.startsWith('rct_elements')));
    for (const section of rct.configSections) {
        result[`rct_elements_${section}`] = selected.filter(e => rct.getConfigSection(e) === section);
    }
    return result;
}

const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
const pkg = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf8'));
const tab = config.items.elements.items;

const oldConfig = JSON.stringify(config);
const oldNative = JSON.stringify(pkg.native);
for (const key of Object.keys(tab).filter(k => k.startsWith('rct_elements'))) {
    delete tab[key];
}
Object.assign(tab, buildSections());
pkg.native = buildNative(pkg.native);

const count = Object.keys(rct.cmdReverse).length;
if (process.argv.includes('--check')) {
    const outdated = [
        oldConfig !== JSON.stringify(config) && 'admin/jsonConfig.json',
        oldNative !== JSON.stringify(pkg.native) && 'io-package.json (native)',
    ].filter(Boolean);
    if (outdated.length) {
        console.error(`${outdated.join(' and ')} outdated - run "npm run build:admin"`);
        process.exit(1);
    }
    console.log(`admin configuration is up to date (${count} parameters in ${rct.configSections.length} sections)`);
} else {
    fs.writeFileSync(CONFIG_FILE, `${JSON.stringify(config, null, 4)}\n`);
    fs.writeFileSync(PACKAGE_FILE, `${JSON.stringify(pkg, null, 2)}\n`);
    console.log(`admin configuration updated: ${count} parameters in ${rct.configSections.length} sections`);
}
