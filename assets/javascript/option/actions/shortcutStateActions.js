/** @jsx React.DOM */

'use strict';

var AppDispatcher = require('../dispatcher/dispatcher');
var ShortcutStateConstants = require('../constants/shortcutStateConstants');

var ShortcutStateActions = {
    updateShortcutState: function (enabled) {
        AppDispatcher.dispatch({
            actionType: ShortcutStateConstants.SHORTCUT_UPDATE,
            enabled: enabled
        });
    },
    resetShortcutState: function () {
        AppDispatcher.dispatch({
            actionType: ShortcutStateConstants.SHORTCUT_RESET,
        });
    },
};

module.exports = ShortcutStateActions;
