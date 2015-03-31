'use strict';

var copyToClipboard = require('./copyToClipboard');
var settings = require('./settings');
require('./analytics');

var cb = chrome.browserAction;


function copy(text) {
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);
}


function copyHandler(tab, actionId) {
    // preparing copy
    // show badge text, color
    cb.setBadgeText({text: '...'});
    cb.setBadgeBackgroundColor(settings.STATUSCOLOR.ok);

    var pattern = JSON.parse(localStorage.getItem('cp2')).actions.filter(function (action) {
        return action.id === actionId;
    });
    if (pattern.length) {
        pattern = pattern[0];
    }

    copyToClipboard(tab, pattern, function (result) {
        if (result.status == 'err')
            cb.setBadgeBackgroundColor(settings.STATUSCOLOR.err);
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
    var dActions = JSON.parse(localStorage.getItem('cp2')).actions;

    for (var i in dActions) {
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
        localStorage.setItem('cp2', JSON.stringify(buf));
        console.log("sync setting pattern to " + buf);
    }
}

//chrome.storage.sync.clear();


function syncInit() {
    var syncObject = {
        'pattern': settings.pattern,
        'actions': settings.ACTIONS,
        'version': settings.VERSION,
        'previewData': settings.PREVIEWDATA
    };

    localStorage.setItem('resetData', JSON.stringify({
        'pattern': settings.pattern,
        'actions': settings.ACTIONS
    }));

    chrome.storage.sync.set({
        "cp2": syncObject
    }, function () {
        valueChanged(syncObject);
    });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes["cp2"]) {
        valueChanged(changes["cp2"].newValue);
    }
});


chrome.storage.sync.get("cp2", function (val) {
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

window.copyHandler = copyHandler;
