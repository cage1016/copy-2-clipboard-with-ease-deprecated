/** @jsx React.DOM */

/*jshint -W109*/
/*jshint -W108*/

'use strict';

var React = require('react');

var ActionsListItem = require('./optionApp.actionListItem.react');


var ActionList = React.createClass({

    render: function () {

        var allActions = this.props.actions;
        var actions = [];

        for (var key in allActions) {
            actions.push(<ActionsListItem key={key} action={allActions[key]} shortcutEnabled={this.props.shortcutEnabled}/>);
        }

        var shortcutTh = null;
        if (this.props.shortcutEnabled) {
            shortcutTh = <th>Default Shortcut</th>;
        }

        return (
            <table className="ui table">
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Enable</th>
                        {shortcutTh}
                    </tr>
                </thead>
                <tbody>
                        {actions}
                </tbody>
            </table>
        );
    }


});

module.exports = ActionList;
