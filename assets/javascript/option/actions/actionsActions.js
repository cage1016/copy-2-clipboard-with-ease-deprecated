var AppDispatcher = require('../dispatcher/dispatcher');
var ActionsConstants = require('../constants/actionsConstants');

var ActionsActions = {
    updateActionDefault: function (id) {
        AppDispatcher.dispatch({
            actionType: ActionsConstants.ACTIONS_UPDATE_DEFAULT,
            id: id
        });
    },

    setActionEnable: function (id, enabled) {
        AppDispatcher.dispatch({
            actionType: ActionsConstants.ACTIONS_UPDATE_ENABLED,
            id: id,
            enabled: enabled
        });
    },

    resetAction: function () {
        AppDispatcher.dispatch({
            actionType: ActionsConstants.ACTIONS_RESET
        });
    },

    reassignActionDefault: function(){
        AppDispatcher.dispatch({
            actionType: ActionsConstants.ACTIONS_REASSIGN_DEFAULT
        });
    }
};

module.exports = ActionsActions;
