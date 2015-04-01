'use strict';

var AppDispatcher = require('../dispatcher/dispatcher');
var EventEmitter = require('events').EventEmitter;
var PatternConstants = require('../constants/patternConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var PatternStore = assign({}, EventEmitter.prototype, {
    get: function () {
        return JSON.parse(localStorage.getItem('cp2')).pattern;
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
    var pattern, cp2;

    switch (action.actionType) {
        case PatternConstants.PATTERN_UPDATE:
            pattern = action.pattern.trim();

            cp2 = JSON.parse(localStorage.getItem('cp2'));
            cp2.pattern = pattern;

            for (var i in cp2.actions) {
                var cpaction = cp2.actions[i];
                if (cpaction.id === 'copyTitleUrl' || cpaction.id === 'copyTitleUrlShorten') {
                    action.name = pattern;
                }
            }
            localStorage.setItem('cp2', JSON.stringify(cp2));

            chrome.storage.sync.set({'cp2': cp2}, function () {
                console.log('PatternConstants.PATTERN_UPDATE: setting cp2');
            });

            PatternStore.emitChange();
            break;

        case PatternConstants.PATTERN_RESET:

            var resetPattern = JSON.parse(localStorage.getItem('resetData')).pattern;
            cp2 = JSON.parse(localStorage.getItem('cp2'));
            cp2.pattern = resetPattern;

            localStorage.setItem('cp2', JSON.stringify(cp2));

            chrome.storage.sync.set({'cp2': cp2}, function () {
                console.log('PatternConstants.PATTERN_RESET: setting cp2');
            });

            PatternStore.emitChange();
            break;
    }

});

module.exports = PatternStore;
