import {sectionContentsQuery, sectionDismissableQuery, vidQuery} from './queries';
import {HIDE_WATCHED_TOGGLE} from './subs-ui';
import {log} from './util';
import {SubscriptionVideo} from './Video';

const hidden = [];
let hideWatched = null;
let hidePremieres = null;
let hideShorts = null;
let intervalId = null;

function isYouTubeWatched(item) {
    const ytWatchedPercentThreshold = settings['settings.mark.watched.youtube.watched'];
    return ytWatchedPercentThreshold === true && (
        (
            item.querySelectorAll('yt-formatted-string.style-scope.ytd-thumbnail-overlay-playback-status-renderer').length > 0 // has "WATCHED" on thumbnail
            || item.querySelectorAll('#progress.style-scope.ytd-thumbnail-overlay-resume-playback-renderer').length > 0 // has progress bar on thumbnail TODO allow percentage threshold
        )
        || item.hasAttribute('is-dismissed') // also hide empty blocks left in by pressing "HIDE" button
    );
}

function hideWatchedChanged(event) {
    try {
        const toggle = document.getElementById(HIDE_WATCHED_TOGGLE);
        log('Hide Watched checkbox was changed. New value is: ' + !hideWatched);

        if (hideWatched) {
            hideWatched = false;
            toggle.classList.remove('subs-btn-hide-watched-checked');
            toggle.classList.add('subs-btn-hide-watched-unchecked');
            showWatched();
        }
        else {
            hideWatched = true;
            toggle.classList.remove('subs-btn-hide-watched-unchecked');
            toggle.classList.add('subs-btn-hide-watched-checked');
            removeWatchedAndAddButton();
        }
    }
    catch (error) {
        logError(error);
    }
}

function collapseSectionChanged(event) {
    try {
        const checkbox = event.target;
        log('Checkbox for section ' + checkbox.getAttribute('id') + ' changed. New value is: ' + checkbox.checked);

        const contentDiv = checkbox.closest(sectionDismissableQuery()).querySelector(sectionContentsQuery());
        if (checkbox.checked) {
            contentDiv.style.display = '';
        }
        else {
            contentDiv.style.display = 'none';
            loadMoreVideos();
        }
    }
    catch (error) {
        logError(error);
    }
}

function markAllAsWatched() {
    for (const item of document.querySelectorAll(vidQuery())) {
        new SubscriptionVideo(item).markWatched();
    }

    loadMoreVideos();
}

function loadMoreVideos() {
    log('Loading more videos');

    // workaround to load more videos, slightly scroll in the sidebar :)
    const sidebar = document.getElementById('guide-inner-content');
    const top = sidebar.scrollTop;
    // +1 -1 so the scroll moves a bit even if its at complete bottom or top
    sidebar.scrollTop += 1;
    sidebar.scrollTop -= 1;
    // move it back to original position
    sidebar.scrollTop = top;
}

async function initSubs() {
    log('Initializing subs page...');

    await loadWatchedVideos();

    if (hideWatched == null || !settings['settings.hide.watched.keep.state']) {
        hideWatched = settings['settings.hide.watched.default'];
    }
    if (hidePremieres == null) {
        hidePremieres = settings['settings.hide.premieres'];
    }
    if (hideShorts == null) {
        hideShorts = settings['settings.hide.shorts'];
    }

    buildUI();

    intervalId = window.setInterval(() => {
        if (hideWatched) {
            try {
                removeWatchedAndAddButton();
            }
            catch (error) {
                logError(error);
            }
        }
    }, settings['settings.hide.watched.refresh.rate']);

    removeWatchedAndAddButton();

    log('Initializing subs page... DONE');
}

function stopSubs() {
    log('Stopping subs page behaviour');

    removeUI();
    window.clearInterval(intervalId);
}
