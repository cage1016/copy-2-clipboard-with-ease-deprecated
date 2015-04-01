var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var ActionsConstants = require('../constants/actionsConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var ActionsStore = assign({}, EventEmitter.prototype, {
    getAll: function () {
        return JSON.parse(localStorage.getItem('cp2')).actions;
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
    var id;
    switch (action.actionType) {
        case ActionsConstants.ACTIONS_UPDATE_DEFAULT:
            id = action.id;

            if (id) {
                var cp2 = JSON.parse(localStorage.getItem('cp2'));

                for (var i in cp2.actions) {
                    var cpaction = cp2.actions[i];
                    cpaction.default = false;
                    if (id === cpaction.id) {
                        cpaction.default = true;
                    }
                }
                localStorage.setItem('cp2', JSON.stringify(cp2));

                chrome.storage.sync.set({"cp2": cp2}, function () {
                    console.log("ActionsConstants.ACTIONS_UPDATE_DEFAULT: setting cp2");
                });

                ActionsStore.emitChange();
            }
            break;

        case ActionsConstants.ACTIONS_UPDATE_ENABLED:
            id = action.id;

            if (id) {
                var cp2 = JSON.parse(localStorage.getItem('cp2'));

                cp2.actions = cp2.actions.map(function (c) {
                    if (c.id === id) {
                        c.enable = action.enabled;
                    }
                    return c;
                });

                var enabled_actions = cp2.actions.filter(function (c) {
                    return c.enable;
                });

                // reset default
                if (enabled_actions.length === 1) {
                    cp2.actions = cp2.actions.map(function (c) {
                        c.default = false;
                        if (enabled_actions[0].id === c.id) {
                            c.default = true;
                        }
                        return c;
                    });
                }


                localStorage.setItem('cp2', JSON.stringify(cp2));

                chrome.storage.sync.set({"cp2": cp2}, function () {
                    console.log("ActionsConstants.ACTIONS_UPDATE_ENABLED: setting cp2");
                });

                ActionsStore.emitChange();
            }

            break;

        case ActionsConstants.ACTIONS_RESET:

            var resetActions = JSON.parse(localStorage.getItem('resetData')).actions;
            var cp2 = JSON.parse(localStorage.getItem('cp2'));
            cp2.actions = resetActions;

            localStorage.setItem('cp2', JSON.stringify(cp2));

            chrome.storage.sync.set({"cp2": cp2}, function () {
                console.log("ActionsConstants.ACTIONS_RESET: setting cp2");
            });

            ActionsStore.emitChange();

            break;

        case ActionsConstants.ACTIONS_REASSIGN_DEFAULT:

            var cp2 = JSON.parse(localStorage.getItem('cp2'));

            for (var i in cp2.actions) {
                cp2.actions[i].default = false;
                if (cp2.actions[i].enable) {
                    cp2.actions[i].default = true;
                }
            }

            localStorage.setItem('cp2', JSON.stringify(cp2));

            chrome.storage.sync.set({"cp2": cp2}, function () {
                console.log("ActionsConstants.ACTIONS_REASSIGN_DEFAULT: setting cp2");
            });

            ActionsStore.emitChange();

            break;
    }

});

module.exports = ActionsStore;
