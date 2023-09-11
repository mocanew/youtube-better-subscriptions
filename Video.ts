import {watchedVideos} from './common';
import {HIDDEN_CLASS, MARK_UNWATCHED_BTN, MARK_WATCHED_BTN, METADATA_LINE} from './subs-ui';
import {log} from './util';

export class Video {
    containingDiv: HTMLElement;

    videoId: string;
    buttonId: string;
    isWatched: boolean;

    isShort: boolean;
    isPremiere: boolean;

    constructor(containingDiv: HTMLElement) {
        this.containingDiv = containingDiv;

        const videoUrl = containingDiv.querySelectorAll('a')[0].getAttribute('href');
        if (videoUrl !== null) {
            if (videoUrl.includes('shorts')) {
                this.videoId = videoUrl.split('shorts/')[1].split('&')[0];
            }
            else {
                this.videoId = videoUrl.split('=')[1].split('&')[0];
            }
        }
        else {
            log('Video URL is null - ad.');
        }

        this.isWatched = watchedVideos.includes(this.videoId);
        this.buttonId = this.isWatched ? MARK_UNWATCHED_BTN : MARK_WATCHED_BTN;

        log(`Checking video ${this.videoId} for premiere`);
        this.isPremiere = containingDiv.querySelector('ytd-thumbnail-overlay-time-status-renderer')?.getAttribute('overlay-style') === 'UPCOMING';

        log(`Checking video ${this.videoId} for short`);
        if (videoUrl !== null) {
            this.isShort = (videoUrl.includes('shorts') || videoUrl.includes('adurl'));
        }
        else {
            log('Video URL is null - ad.');
            this.isShort = true;
        }
    }

    hasButton() {
        throw new Error('Subclasses must implement hasButton method');
    }

    addButton() {
        throw new Error('Subclasses must implement addButton method');
    }

    hide() {
        hidden.push(this.containingDiv);
        this.containingDiv.style.display = 'none';
        this.containingDiv.classList.add(HIDDEN_CLASS);
    }

    markWatched() {
        // find Mark as watched button and change it to Unmark as watched
        const metaDataLine = this.containingDiv.querySelector(`#${METADATA_LINE}`);
        if (metaDataLine !== null) {
            const dismissibleDiv = metaDataLine.parentNode;
            metaDataLine.remove();

            const markUnwatchedBtn = buildMarkWatchedButton(dismissibleDiv, this.containingDiv, this.videoId, false);
            dismissibleDiv.append(markUnwatchedBtn);
        }

        if (hideWatched) {
            this.hide();
            processSections();
        }

        this.isWatched = true;
        if (!watchedVideos.includes(this.videoId)) {
            watchedVideos.unshift(this.videoId);
            saveWatchedVideos();
        }
    }

    markUnwatched() {
        if (watchedVideos.includes(this.videoId)) {
            watchedVideos.splice(watchedVideos.indexOf(this.videoId), 1);

            saveWatchedVideos();
        }
    }
}


export class SubscriptionVideo extends Video {
    contentDiv: HTMLElement;

    constructor(containingDiv) {
        super(containingDiv);
        this.contentDiv = this.containingDiv.querySelector('.ytd-rich-item-renderer');
    }

    hasButton() {
        return this.contentDiv.querySelector('#' + this.buttonId) !== null;
    }

    addButton() {
        const buttonContainer = this.contentDiv.firstChild;
        // isWatched = false - build "Mark as watched"
        // isWatched = true  - build "Mark as unwatched"
        const markButton = buildMarkWatchedButton(buttonContainer, this.containingDiv, this.videoId, !this.isWatched);
        buttonContainer.append(markButton);
    }
}
