const LOG_HEADER = '[YT-Better-Subs] ';

const printDate = false;

function prepareMessage(content = null) {
    let message = LOG_HEADER;
    if (printDate) {
        message += new Date().toTimeString() + ': ';
    }
    if (content) {
        message += (typeof content === 'object') ? JSON.stringify(content) : content;
    }

    return message;
}

export function log(content) {
    if (settings['settings.log.enabled']) {
        console.log(prepareMessage(content));
    }
}

export function logError(error) {
    console.error(prepareMessage('ERROR! '), error.message);
    console.error(error.stack.slice(0, 1000));
}

export function download(filename, content, applicationType = 'text/plain') {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:' + applicationType + ';charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.append(element);

    element.click();

    element.remove();
}
export function isRendered(domObj: Element) {
    if (domObj === document.body) {
        return true;
    }

    const cs = window.getComputedStyle(domObj);
    if (cs.getPropertyValue('display') !== 'none' && cs.getPropertyValue('visibility') !== 'hidden') {
        return isRendered(domObj.parentNode as Element);
    }
    return false;
}
