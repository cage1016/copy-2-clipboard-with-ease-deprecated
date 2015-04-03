'use strict';

var log = require('../../log');
var copy2clip = require('../../copy2clip');

var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var PatternConstants = require('../constants/patternConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var PatternStore = assign({}, EventEmitter.prototype, {
    get: function () {
        return copy2clip.getPattern();
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

    PatternStore.emitChange();
};

AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case PatternConstants.PATTERN_UPDATE:

            copy2clip.setPattern(action.pattern.trim());

            var actionMap = function (item) {
                if (item.id === 'copyTitleUrl' || item.id === 'copyTitleUrlShorten') {
                    item.name = action.pattern.trim();
                }
                return item;
            };
            var needToUpdateActions = copy2clip.getActions().map(actionMap);
            copy2clip.setActions(needToUpdateActions);

            handler('PatternConstants.PATTERN_UPDATE: setting cp2');
            break;

        case PatternConstants.PATTERN_RESET:

            var resetData = copy2clip.getResetData();
            copy2clip.setPattern(resetData.pattern);

            handler('PatternConstants.PATTERN_RESET: setting cp2');
            break;
    }

});

module.exports = PatternStore;
