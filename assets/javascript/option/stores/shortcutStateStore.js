var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var ShortcutStateConstants = require('../constants/shortcutStateConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var ShortcutStateStore = assign({}, EventEmitter.prototype, {
    get: function () {
        return JSON.parse(localStorage.getItem('cp2')).shortcutEnabled;
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

AppDispatcher.register(function (action) {

    switch (action.actionType) {
        case ShortcutStateConstants.SHORTCUT_UPDATE:

            var cp2 = JSON.parse(localStorage.getItem('cp2'));
            // check how many action are enabled, you can not disable shortcut feature if has last action is enabled
            var actions = cp2.actions.filter(function (action) {
                return action.enable;
            });

            if (actions.length === 0) {
                ShortcutStateStore.emitChange();
                break;
            }


            cp2.shortcutEnabled = action.enabled;

            localStorage.setItem('cp2', JSON.stringify(cp2));

            chrome.storage.sync.set({"cp2": cp2}, function () {
                console.log("ShortcutStateConstants.SHORTCUT_UPDATE: setting cp2");
            });

            ShortcutStateStore.emitChange();
            break;

        case ShortcutStateConstants.SHORTCUT_RESET:

            var shortcutEnabled = JSON.parse(localStorage.getItem('resetData')).shortcutEnabled;
            var cp2 = JSON.parse(localStorage.getItem('cp2'));
            cp2.shortcutEnabled = shortcutEnabled;

            localStorage.setItem('cp2', JSON.stringify(cp2));

            chrome.storage.sync.set({"cp2": cp2}, function () {
                console.log("ShortcutStateConstants.SHORTCUT_RESET: setting cp2");
            });

            ShortcutStateStore.emitChange();
            break;
    }

});


module.exports = ShortcutStateStore;
