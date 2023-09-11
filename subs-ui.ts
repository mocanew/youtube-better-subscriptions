import {PREFIX, brwsr} from './common';
import {sectionTitleQuery, sectionsQuery, vidQuery} from './queries';
import {isRendered, log} from './util';
import {SubscriptionVideo} from './Video';

export const HIDE_WATCHED_TOGGLE = `${PREFIX}hide-watched-toggle`;
export const HIDE_WATCHED_LABEL = `${PREFIX}hide-watched-toggle-label`;
export const MARK_ALL_WATCHED_BTN = `${PREFIX}subs-grid-menu-mark-all`;
export const SETTINGS_BTN = `${PREFIX}subs-grid-menu-settings`;
export const MARK_WATCHED_BTN = `${PREFIX}mark-watched`;
export const MARK_UNWATCHED_BTN = `${PREFIX}mark-unwatched`;
export const METADATA_LINE = `${PREFIX}metadata-line`;
export const COLLAPSE_SECTION_CHECKBOX = `${PREFIX}collapse-section`;

export const HIDDEN_CLASS = `${PREFIX}hidden`;
export const COLLAPSE_CLASS = `${PREFIX}collapse-section`;

let addedElems = [];

function showWatched() {
    log('Showing watched videos');

    for (const item of hidden) {
        item.style.display = '';
        item.classList.remove(HIDDEN_CLASS);
    }
    hidden = [];

    processSections();
}

function buildUI() {
    log('Building subs UI');

    addHideWatchedCheckbox();
    addHideAllMenuButton();
    addSettingsButton();

    if (settings['settings.hide.watched.ui.stick.right']) {
        addedElems[0].after(...addedElems);
    }
}

function buildMenuButtonContainer() {
    const menuButtonContainer = document.createElement('h2');
    menuButtonContainer.classList.add('yt-simple-endpoint');
    menuButtonContainer.classList.add('style-scope');
    menuButtonContainer.classList.add('ytd-compact-link-renderer');

    menuButtonContainer.classList.add('subs-grid-menu-item');

    return menuButtonContainer;
}

function deleteOldButton(ID: string) {
    document.querySelector(`#${ID}`)?.remove();
}

function addSettingsButton() {
    deleteOldButton(SETTINGS_BTN);

    const settingsButton = buildMenuButtonContainer();
    settingsButton.classList.add('subs-btn-settings');
    settingsButton.setAttribute('id', SETTINGS_BTN);

    addElementToMenuUI(settingsButton);

    const messenger = document.getElementById(SETTINGS_BTN);
    messenger.addEventListener('click', () => brwsr.runtime.sendMessage({'action': 'openOptionsPage'}));
}

function addHideAllMenuButton() {
    if (settings['settings.hide.watched.all.label']) {
        deleteOldButton(MARK_ALL_WATCHED_BTN);

        const hideAllButtonContainer = buildMenuButtonContainer();
        hideAllButtonContainer.classList.add('subs-grid-menu-mark-all');
        hideAllButtonContainer.setAttribute('id', MARK_ALL_WATCHED_BTN);

        hideAllButtonContainer.append(document.createTextNode('Mark all as watched'));

        addElementToMenuUI(hideAllButtonContainer);

        const messenger = document.getElementById(MARK_ALL_WATCHED_BTN);
        messenger.addEventListener('click', markAllAsWatched);
    }
}

function addHideWatchedCheckbox() {
    if (settings['settings.hide.watched.label']) {
        deleteOldButton(HIDE_WATCHED_LABEL);

        const hideWatchedLabel = buildMenuButtonContainer();
        hideWatchedLabel.setAttribute('id', HIDE_WATCHED_LABEL);
        hideWatchedLabel.append(document.createTextNode('Hide watched')); //TODO: translations
        addElementToMenuUI(hideWatchedLabel);

        const messenger = document.getElementById(HIDE_WATCHED_LABEL);
        messenger.addEventListener('click', hideWatchedChanged);
    }

    deleteOldButton(HIDE_WATCHED_TOGGLE);

    const toggleContainer = document.createElement('div');
    toggleContainer.setAttribute('id', HIDE_WATCHED_TOGGLE);
    toggleContainer.classList.add('toggle-container', 'style-scope', 'tp-yt-paper-toggle-button');
    if (hideWatched) {
        toggleContainer.classList.add('subs-btn-hide-watched-checked');
    }
    else {
        toggleContainer.classList.add('subs-btn-hide-watched-unchecked');
    }

    const toggleBar = document.createElement('div');
    toggleBar.classList.add('toggle-bar', 'style-scope', 'tp-yt-paper-toggle-button');
    const toggleButton = document.createElement('div');
    toggleButton.classList.add('toggle-button', 'style-scope', 'tp-yt-paper-toggle-button');

    toggleContainer.append(toggleBar);
    toggleContainer.append(toggleButton);

    addElementToMenuUI(toggleContainer);

    const messenger = document.getElementById(HIDE_WATCHED_TOGGLE);
    messenger.addEventListener('click', hideWatchedChanged);
}

function addElementToMenuUI(element) {
    log('Adding element to menu UI');

    const topMenuEnd = document.querySelector('#end');
    if (topMenuEnd != null) { //just in case...
        if (settings['settings.hide.watched.ui.stick.right']) {
            topMenuEnd.prepend(element);
        }
        else {
            topMenuEnd.parentNode.insertBefore(element, topMenuEnd);
        }
    }

    addedElems.push(element);
}

function buildMarkWatchedButton(dismissibleDiv, item, videoId, isMarkWatchedBtn = true) {
    const enclosingDiv = document.createElement('div');
    enclosingDiv.setAttribute('id', METADATA_LINE);
    enclosingDiv.classList.add('style-scope', 'ytd-thumbnail-overlay-toggle-button-renderer');

    const button = document.createElement('button');
    button.setAttribute('id', isMarkWatchedBtn ? MARK_WATCHED_BTN : MARK_UNWATCHED_BTN);
    button.classList.add(isMarkWatchedBtn ? 'subs-btn-mark-watched' : 'subs-btn-mark-unwatched');
    button.setAttribute('role', 'button');

    const vid = new SubscriptionVideo(item);
    if (isMarkWatchedBtn) {
        button.addEventListener('click', () => {
            vid.markWatched();
        });
    }
    else {
        button.addEventListener('click', () => {
            vid.markUnwatched();
            const metaDataElem = item.querySelector('#' + METADATA_LINE);
            const container = metaDataElem.parentNode;
            metaDataElem.remove();
            container.append(buildMarkWatchedButton(dismissibleDiv, item, videoId));
        });
    }

    enclosingDiv.append(button);

    if (isMarkWatchedBtn) {
        dismissibleDiv.classList.remove('semitransparent');
    }
    else {
        dismissibleDiv.classList.add('semitransparent');
    }

    return enclosingDiv;
}

let collapsibleIdNum = 0;

function addCollapsibleBtnToSection(sectionHeader) {
    try {
        // only add if doesnt have it already
        if (sectionHeader.parentNode.querySelector('.' + COLLAPSE_CLASS) == null) {

            const collapsibleId = COLLAPSE_SECTION_CHECKBOX + collapsibleIdNum++;

            const collapseCheckbox = document.createElement('input');
            collapseCheckbox.setAttribute('id', collapsibleId);
            collapseCheckbox.setAttribute('type', 'checkbox');
            collapseCheckbox.checked = true;
            collapseCheckbox.classList.add(COLLAPSE_CLASS);

            sectionHeader.parentNode.append(collapseCheckbox);

            const messenger = document.getElementById(collapsibleId);
            messenger.addEventListener('change', collapseSectionChanged);
        }
    }
    catch (error) {
        logError(error);
    }
}

function processSections() {
    log('Processing sections');

    const sections = document.querySelectorAll(sectionsQuery());
    log('Found ' + sections.length + ' sections.');

    for (const section of sections) {
        const sectionHeader = section.querySelector(sectionTitleQuery());
        // Temporary fix for PAGES.channel TODO: refactor this (when more pages added)
        if (!sectionHeader) {
            break;
        }
        const sectionTitle = sectionHeader.textContent;

        // add collapse button to sections
        addCollapsibleBtnToSection(sectionHeader);

        // hide or show sections
        if (section.querySelector(vidQuery()) == null) {
            // section has no videos that arent hidden, so hide it
            if (!section.classList.contains(HIDDEN_CLASS)) {
                log('Hiding section \'' + sectionTitle + '\'');
                section.style.display = 'none';
                section.classList.add(HIDDEN_CLASS);
            }
        }
        else {
            // section has some videos that arent hidden, in case we hid it before, show it now
            if (section.classList.contains(HIDDEN_CLASS)) {
                log('Showing section \'' + sectionTitle + '\'');
                section.style.display = '';
                section.classList.remove(HIDDEN_CLASS);
            }
        }
    }
    log('Processing sections... Done');
}

function removeWatchedAndAddButton() {
    log('Removing watched from feed and adding overlay');

    let hiddenCount = 0;

    for (const item of document.querySelectorAll(vidQuery())) {
        const vid = new SubscriptionVideo(item);

        if (!vid.isWatched && isYouTubeWatched(item)) {
            vid.markWatched();
        }
        else if (
            (hideWatched && vid.isWatched)
            || (hidePremieres && vid.isPremiere)
            || (hideShorts && vid.isShort)
        ) {
            vid.hide();
            hiddenCount++;
        }

        // does it already have any button?
        if (!vid.hasButton()) {
            vid.addButton();
        }
    }

    const gridElement = document.querySelector('ytd-two-column-browse-results-renderer[page-subtype="subscriptions"] ytd-rich-grid-renderer #contents');
    if (gridElement && isRendered(gridElement)) {
        gridElement.style.display = 'grid';
        gridElement.style.gridTemplateColumns = 'repeat(var(--ytd-rich-grid-items-per-row), minmax(310px, 1fr))';
        gridElement.style.maxWidth = '3150px';

        for (const richSectionElement of gridElement.querySelectorAll(':scope > ytd-rich-section-renderer')) {
            richSectionElement.style.gridColumn = '1 / -1';

            const contents = richSectionElement.querySelector(':scope > #content > ytd-rich-shelf-renderer > #dismissible > #contents');

            if (!contents) {
                continue;
            }
            if (![...contents.childNodes].some(child => isRendered(child))) {
                richSectionElement.style.display = 'none';
            }
        }

        for (const gridRow of gridElement.querySelectorAll(':scope > ytd-rich-grid-row')) {
            gridRow.style.display = 'contents';

            const contents = gridRow.querySelector('#contents');
            if (!contents) {
                continue;
            }
            contents.style.display = 'contents';

            for (const item of contents.querySelectorAll(':scope > ytd-rich-item-renderer')) {
                item.style.width = 'calc(100% - var(--ytd-rich-grid-item-margin))';
            }
        }
    }
    log('Removing watched from feed and adding overlay... Done');

    // if we hid any videos, see if sections need changing, or videos loading
    if (hiddenCount > 0) {
        processSections();
        loadMoreVideos();
    }
}

function removeUI() {
    for (const elem of addedElems) {
        elem.remove();
    }

    addedElems = [];

    // delete built buttons
    for (const e of document.querySelectorAll('#' + METADATA_LINE)) {
        e.remove();
    }

    // make hidden videos visible
    for (const item of hidden) {
        item.style.display = '';
        item.classList.remove(HIDDEN_CLASS);
    }
    hidden = [];
}
