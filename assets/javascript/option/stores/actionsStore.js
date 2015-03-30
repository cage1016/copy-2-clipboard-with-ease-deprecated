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

                for (var i in cp2.actions) {
                    var cpaction = cp2.actions[i];
                    if (id === cpaction.id) {
                        cpaction.enable = action.enabled;
                    }
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
    }

});

module.exports = ActionsStore;
