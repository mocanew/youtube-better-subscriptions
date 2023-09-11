import {getCurrentPage} from './common';
import {log, logError} from './util';

settingsLoadedCallbacks.push(initExtension);

function initExtension() {
    const PAGES = Object.freeze({
        'subscriptions': '/feed/subscriptions',
        'video': '/watch',
        'short': '/shorts',
        'channel': '/videos',
        'home': '',
    });

    async function handlePageChange() {
        //remove trailing /
        const page = getCurrentPage();

        log('Page was changed to ' + page);

        //unload old page
        stopSubs();

        try {
            //handle new page
            switch (page) {
            case PAGES.subscriptions: {
                await initSubs();
                break;
            }
            case PAGES.video: {
                onVideoPage();
                break;
            }
            case PAGES.home: {
                if (settings['settings.hide.watched.support.home']) {
                    initSubs();
                }
                break;
            }
            default: {
                if (page.includes(PAGES.short)) {
                    onShortPage();
                }
                else if (page.includes(PAGES.channel) && settings['settings.hide.watched.support.channel']) {
                    await initSubs();
                }
            }
            }
        }
        catch (error) {
            logError(error);
        }
    }

    function initPageHandler() {
        const pageLoader = document.querySelector('yt-page-navigation-progress');

        // if the page loader element isnt ready, wait for it
        if (pageLoader === null) {
            window.requestAnimationFrame(initPageHandler);
            return;
        }

        log('Found page loader');

        const pageChangeObserver = new MutationObserver((mutations) => {
            for (const mutationRecord of mutations) {
                //is page fully loaded?
                if (mutationRecord.target.attributes['aria-valuenow'].value === '100') {
                    handlePageChange();
                }
            }
        });

        //observe when the page loader becomes visible or hidden
        pageChangeObserver.observe(pageLoader, {attributes: true, attributeFilter: ['hidden']});

        //first page doesnt trigger the event, so lets do it manually
        handlePageChange();
    }

    log('Initializing...');
    initPageHandler();
}
