/** @jsx React.DOM */

var React = require('react');

var ActionsStore = require('../option/stores/actionsStore');
var ActionListItem = require('./popupApp.actionListItem.react');


function getStateFromStores() {
    return {
        actions: ActionsStore.getAll()
    };
}

var popupApp = React.createClass({

    getInitialState: function () {
        return getStateFromStores();
    },

    render: function () {

        var allActions = this.state.actions.filter(function (action) {
            return action.enable;
        });
        var actions = [];


        for (var key in allActions) {
            actions.push(<ActionListItem action={allActions[key]} />);
        }

        return (
            <div>
            {actions}
            </div>
        );
    }

});

module.exports = popupApp;
