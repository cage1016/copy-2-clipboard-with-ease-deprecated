'use strict';

var shortenUrl = require('./shortUrl');

var regexTitle = /title/gi;
var regexUrl = /url/gi;
function copyToClipboard(tab, pattern, callback) {

    switch (pattern.id) {
        case 'copyTitle':
            console.log('copy text = ' + tab.title);
            callback({message: tab.title, status: 'ok'});
            break;
        case 'copyTitleUrl':
            var text = pattern.name.replace(regexUrl, tab.url).replace(regexTitle, tab.title);
            console.log('copy text = ' + text);
            callback({message: text, status: 'ok'});
            break;
        case 'copyTitleUrlShorten':
            shortenUrl(tab.url, tab.incognito, function (response) {
                if (response.status !== 'err') {
                    var text = pattern.name.replace(regexUrl, response.message).replace(regexTitle, tab.title);
                    console.log('copy text = ' + text);
                    callback({message: text, status: 'ok'});
                } else {
                    console.log('err = ' + response.message);
                    callback({message: response.message, status: response.status});
                }
            });
            break;
        case 'copyUrlShorten':
            shortenUrl(tab.url, tab.incognito, function (response) {
                if (response.status !== 'err') {
                    console.log('copy text = ' + response.message);
                    callback({message: response.message, status: 'ok'});
                } else {
                    console.log('err = ' + response.message);
                    callback({message: response.message, status: response.status});
                }
            });
            break;
        case 'copyUrl':
            console.log('copy text = ' + tab.url);
            callback({message: tab.url, status: 'ok'});
            break;
    }
}


module.exports = copyToClipboard;
