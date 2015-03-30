var AppDispatcher = require('../dispatcher/dispatcher');
var PatternConstants = require('../constants/patternConstants');

var PatternActions = {
    updatePattern: function (pattern) {
        AppDispatcher.dispatch({
            actionType: PatternConstants.PATTERN_UPDATE,
            pattern: pattern
        });
    },

    resetPattern: function(){
        AppDispatcher.dispatch({
            actionType: PatternConstants.PATTERN_RESET
        });
    }
};

module.exports = PatternActions;
