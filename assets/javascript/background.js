/*jshint -W083 */

'use strict';

var copyToClipboard = require('./copyToClipboard');
var settings = require('./settings');
var log = require('./log');
var copy2clip = require('./copy2clip');
require('./analytics');

var cb = chrome.browserAction;


function copy(text) {
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = 'off';
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand('Copy', false, null);
    document.body.removeChild(copyDiv);
}


function copyHandler(tab, actionId) {
    // preparing copy
    // show badge text, color
    cb.setBadgeText({text: '...'});
    cb.setBadgeBackgroundColor(settings.STATUSCOLOR.ok);

    var action = copy2clip.getActionById(actionId);

    copyToClipboard(tab, action, function (result) {
        if (result.status === 'err') {
            cb.setBadgeBackgroundColor(settings.STATUSCOLOR.err);
        }
        else {
            cb.setBadgeBackgroundColor(settings.STATUSCOLOR.ok);
            copy(result.message);
        }

        cb.setBadgeText({text: result.status});
        setTimeout(function () {
            cb.setBadgeText({text: ''});
        }, 500);
    });
}


function createContextMenu() {
    chrome.contextMenus.removeAll();
    var actions = copy2clip.getActions();

    for (var i in actions) {
        var action = settings.ACTIONS[i];
        (function (action) {
            chrome.contextMenus.create({
                'title': action.description,
                'contexts': ['page', 'link', 'selection', 'image'],
                'onclick': function (info, tab) {
                    copyHandler(tab, action.id);
                }
            });
        })(action);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    createContextMenu();
});

function valueChanged(newValue) {
    if (newValue) {
        var buf = newValue;
        buf.lastupdated = Date.now();

        copy2clip.save(buf);

        log('sync setting pattern to');
        log(buf);
    }
}

//chrome.storage.sync.clear();


function syncInit() {
    var syncObject = {
        'pattern': settings.pattern,
        'actions': settings.ACTIONS,
        'version': settings.VERSION,
        'previewData': settings.PREVIEWDATA,
        'shortcutEnabled': settings.SHORTCUT_ENABLED
    };

    copy2clip.save({
        'resetData': {
            'pattern': settings.pattern,
            'actions': settings.ACTIONS,
            'shortcutEnabled': settings.SHORTCUT_ENABLED
        }
    });

    chrome.storage.sync.set({
        'cp2': syncObject
    }, function () {
        valueChanged(syncObject);
    });
}

chrome.storage.onChanged.addListener(function (changes) {
    if (changes.cp2) {
        valueChanged(changes.cp2.newValue);
    }
});


chrome.storage.sync.get('cp2', function (val) {
    if (!val.cp2) {
        syncInit();
    } else {
        if (!val.cp2.version) {
            syncInit();
            return;
        }

        if (val.cp2.version < settings.VERSION) {
            syncInit();
            return;
        }

        valueChanged(val.cp2);
    }
});

chrome.commands.onCommand.addListener(function (command) {
    console.log('Command:', command);
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {

        if (copy2clip.getShortcutEnabled()) {

            var defaultAction = copy2clip.getDefaultAction();
            if (defaultAction) {
                copyHandler(tabs[0], defaultAction.id);

            }
        }
    });
});

// assign copyHandler to global for chrome.extension.getBackgroundPage()
window.copyHandler = copyHandler;
