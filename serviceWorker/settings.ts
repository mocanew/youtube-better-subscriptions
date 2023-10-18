import brwsr from '../browser';
import {DEFAULT_SETTINGS, ISettings} from '../settings';

import {log} from './common';

const SETTINGS_KEY = 'settings';

let settings = {...DEFAULT_SETTINGS};

export async function loadSettings() {
    if (!brwsr.storage.onChanged.hasListener(onStorageChanged)) {
        brwsr.storage.onChanged.addListener(onStorageChanged);
    }

    const items = await brwsr.storage.sync.get(SETTINGS_KEY);
    settings = {...settings, ...(items[SETTINGS_KEY] as ISettings)};

    log('Settings loaded:');
    log(items[SETTINGS_KEY]);
}

function onStorageChanged(changes: browser.storage.ChangeDict, areaName: browser.storage.StorageName) {
    if (areaName !== 'sync' || !(SETTINGS_KEY in changes)) {
        return;
    }

    loadSettings();
}

export function getSettings() {
    return settings;
}