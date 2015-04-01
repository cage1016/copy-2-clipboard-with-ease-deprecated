'use strict';

var log = require('../../log');
var copy2clip = require('../../copy2clip');

var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var ShortcutStateConstants = require('../constants/shortcutStateConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var ShortcutStateStore = assign({}, EventEmitter.prototype, {
    get: function () {
        return copy2clip.getShortcutEnabled();
    },

    emitChange: function () {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function (callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function (callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});


var handler = function (msg) {
    chrome.storage.sync.set({'cp2': copy2clip.toCp2()}, function () {
        log(msg);
    });

    ShortcutStateStore.emitChange();
};

AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case ShortcutStateConstants.SHORTCUT_UPDATE:

            var actionFilter = function (item) {
                return item.enable;
            };
            var actions = copy2clip.getActions(actionFilter);

            if (actions.length === 0) {
                ShortcutStateStore.emitChange();
                break;
            }

            copy2clip.setShortcutEnabled(action.enabled);

            handler('ShortcutStateConstants.SHORTCUT_UPDATE: setting cp2');
            break;

        case ShortcutStateConstants.SHORTCUT_RESET:

            var shortcutEnabled = copy2clip.getResetData().shortcutEnabled;
            copy2clip.setShortcutEnabled(shortcutEnabled);


            handler('ShortcutStateConstants.SHORTCUT_RESET: setting cp2');
            break;
    }


});


module.exports = ShortcutStateStore;
