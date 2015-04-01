'use strict';

module.exports.URL = 'https://www.googleapis.com/urlshortener/v1/url';
module.exports.KEY = 'AIzaSyCWf9RZIACRWqEyfgjE7OY_c0o46D97WfA';
module.exports.TIMER = null;
module.exports.MILLISECONDS = 10000;
module.exports.STATUSCOLOR = {
    err: {
        color: '#ff4c62'
    },
    ok: {
        color: '#3c763d'
    }
};

// initial value
module.exports.pattern = 'url (title)';
module.exports.PREVIEWDATA = {
    URL: 'https://www.google.com',
    SHOTERNURL: 'http://goo.gl/Njku',
    TITLE: 'Google'
};
module.exports.SHORTCUT_ENABLED = true;

module.exports.VERSION = '0.0.104';
module.exports.ACTIONS = [{
    id: 'copyTitle',
    name: 'title',
    description: 'copy tab title',
    default: true,
    enable: true
}, {
    id: 'copyTitleUrl',
    name: 'url (title)',
    description: 'copy tab title with url',
    default: false,
    enable: true
}, {
    id: 'copyTitleUrlShorten',
    name: 'url (title)',
    small: ' Shorten',
    description: 'copy tab title with Shorten url',
    default: false,
    enable: true
}, {
    id: 'copyUrlShorten',
    name: 'url',
    small: ' Shorten',
    description: 'copy tab Shorten url',
    default: false,
    enable: true
}, {
    id: 'copyUrl',
    name: 'url',
    description: 'copy tab url',
    default: false,
    enable: true
}];
