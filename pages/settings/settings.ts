import {brwsr, loadSettings} from '../../common';
import {log, logError} from '../../util';

log('Initializing settings page...');

document.addEventListener('DOMContentLoaded', setupButtons);
document.addEventListener('DOMContentLoaded', initSettings);

async function initSettings() {
    const settings = await loadSettings();

    // hideSpinners
    for (const elem of document.querySelectorAll('.sk-circle')) {
        elem.classList.add('hidden');
    }

    // showSettings
    for (const elem of document.querySelectorAll('[id^=\'settings-\']')) {
        elem.classList.remove('hidden');
    }

    // updateSettings
    for (const key in settings) {
        const elem = document.getElementById(key);
        if (elem) {
            if (elem.matches('input[type="checkbox"]')) {
                elem.checked = settings[key];
            }
            else {
                elem.value = settings[key];
            }
        }
        else {
            logError({
                'message': `Updating setting #${key} returned ${elem}`,
                'stack': 'settings.js:updateSettings',
            });
        }
    }
}

function saveSettings() {
    const values = {};

    for (const elem of document.querySelectorAll('input[id^=\'settings.\']')) {
        if (elem.matches('input[type="checkbox"]')) {
            values[elem.id] = elem.checked;
        }
        else {
            values[elem.id] = elem.value;
        }
    }

    log('Saving values:' + JSON.stringify(values));
    brwsr.storage.sync.set({
        [SETTINGS_KEY]: values,
    });
}

function setupButtons() {
    document.querySelector('#settings-save').addEventListener('click', saveSettings);
    document.querySelector('#watched.export').addEventListener('click', exportVideos);
    document.querySelector('#watched.import').addEventListener('click', importVideos);
    document.querySelector('#watched.clear').addEventListener('click', clearVideos);
}

async function exportVideos() {
    await loadWatchedVideos();

    download('[Better Subs] video export ' + new Date() + '.json', JSON.stringify(watchedVideos), 'application/json');
}

async function importVideos() {
    const file = document.querySelector('#watched.import.file').files[0];

    if (!file) {
        window.alert('No file selected!');
        return;
    }

    const text = await file.text();

    try {
        const parsed = JSON.parse(text);

        if (Array.isArray(parsed)) {
            // new format
            watchedVideos.unshift(...parsed);
        }
        else if (typeof parsed === 'object') {
            // old format
            const sortedKeys = (
                Object.keys(parsed)
                    .filter(key => typeof parsed[key] === 'number')
                    .sort((key1, key2) => parsed[key1] - parsed[key2])
            );

            watchedVideos.unshift(...sortedKeys);
        }
        await saveWatchedVideos();

        window.alert('Imported ' + Object.keys(parsed).length + ' watched videos successfully');
    }
    catch {
        window.alert('Error parsing import file!');
    }
}

async function clearVideos() {
    if (window.confirm('This is a destructive operation and will remove all of your marked as watched videos! \nAre you sure?')) {
        await Promise.all(
            Object.keys((await brwsr.storage.sync.get(null)) || {}).map(key => {
                if (key.indexOf(VIDEO_WATCH_KEY) === 0) {
                    brwsr.storage.sync.remove(key);
                }
            }),
        );
    }
}
