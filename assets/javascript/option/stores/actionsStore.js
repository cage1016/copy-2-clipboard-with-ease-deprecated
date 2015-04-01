'use strict';

var log = require('../../log');
var copy2clip = require('../../copy2clip');

var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionsConstants = require('../constants/actionsConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var ActionsStore = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return copy2clip.getActions();
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

    ActionsStore.emitChange();
};

AppDispatcher.register(function (action) {
    var id;
    switch (action.actionType) {
        case ActionsConstants.ACTIONS_UPDATE_DEFAULT:
            id = action.id;

            if (id) {
                var actionMap = function (item) {
                    item.default = false;
                    if (id === item.id) {
                        item.default = true;
                    }
                    return item;
                };
                var actions = copy2clip.getActions().map(actionMap);
                copy2clip.setActions(actions);

                handler('ActionsConstants.ACTIONS_UPDATE_DEFAULT: setting cp2');
            }
            break;

        case ActionsConstants.ACTIONS_UPDATE_ENABLED:
            id = action.id;

            if (id) {

                // 1.
                var actionMap2 = function (item) {
                    if (item.id === id) {
                        item.enable = action.enabled;
                    }
                    return item;
                };

                copy2clip.setActions(copy2clip.getActions().map(actionMap2));

                // 2.
                var actionFilter = function (item) {
                    return item.enable;
                };
                var enabledActions = copy2clip.getActions().filter(actionFilter);

                var defaultAction = copy2clip.getDefaultAction();
                if (!defaultAction.enable) {
                    // reset default
                    var actionMap3 = function (item) {
                        item.default = false;
                        if (enabledActions[0].id === item.id) {
                            item.default = true;
                        }
                        return item;
                    };
                    copy2clip.setActions(copy2clip.getActions().map(actionMap3));
                }

                handler('ActionsConstants.ACTIONS_UPDATE_ENABLED: setting cp2');
            }

            break;

        case ActionsConstants.ACTIONS_RESET:

            var resetActions = copy2clip.getResetData().actions;
            copy2clip.setActions(resetActions);

            handler('ActionsConstants.ACTIONS_RESET: setting cp2');

            break;

        case ActionsConstants.ACTIONS_REASSIGN_DEFAULT:

            var actionMap4 = function (item) {
                item.default = false;
                if (item.enable) {
                    item.default = true;
                }
                return item;
            };
            copy2clip.setActions(copy2clip.getActions().map(actionMap4));

            handler('ActionsConstants.ACTIONS_REASSIGN_DEFAULT: setting cp2');

            break;
    }

});

module.exports = ActionsStore;
