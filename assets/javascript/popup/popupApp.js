/** @jsx React.DOM */

/*jshint -W109*/
/*jshint -W108*/

'use strict';

var React = require('react');

var ActionsStore = require('../option/stores/actionsStore');
var ShortcutStateStore = require('../option/stores/shortcutStateStore');

var ActionListItem = require('./popupApp.actionListItem.react');


function getStateFromStores() {
    return {
        actions: ActionsStore.getAll(),
        shortcutEnabled: ShortcutStateStore.get()
    };
}

var popupApp = React.createClass({

    getInitialState: function () {
        return getStateFromStores();
    },

    render: function () {

        var actions = [], openOpen = null;
        var allActions = this.state.actions.filter(function (action) {
            return action.enable;
        });

        for (var key in allActions) {
            actions.push(<ActionListItem action={allActions[key]} shortcutEnabled={this.state.shortcutEnabled}/>);
        }

        if (!actions.length) {
            openOpen = <div className="fluid ui button action-item" onClick={this._openOption}>click to enable action.</div>;
        }

        return (
            <div>
                {actions}
                {openOpen}
            </div>
        );
    },

    _openOption: function () {
        chrome.tabs.create({
            url: 'chrome-extension://enhljbbieiohkpeejjfidfmmldjlhjhd/options.html'
        });
    }

});

module.exports = popupApp;
