/** @jsx React.DOM */

/*jshint -W109*/
/*jshint -W108*/

'use strict';

var React = require('react');
var ActionsActions = require('../actions/actionsActions');

var cx = require('react/lib/cx');

var ActionListItem = React.createClass({

    render: function () {

        var shortcutTd = null;
        if (this.props.shortcutEnabled) {
            shortcutTd = <td>
                <input type="radio" name="default" checked={this.props.action.default} onChange={this._defaultChage} />
            </td>;
        }

        return (
            <tr className={cx({
                "positive": this.props.action.default && this.props.shortcutEnabled
            })}>
                <td>
                    <label>{this.props.action.description}</label>
                </td>
                <td className={cx({
                    "read-only disabled": this.props.action.default && this.props.shortcutEnabled
                })}>
                    <input type="checkbox" checked={this.props.action.enable} onChange={this._enableChange} />
                </td>
                {shortcutTd}
            </tr>
        );
    },

    _enableChange: function () {
        ActionsActions.setActionEnable(this.props.action.id, !this.props.action.enable);
    },

    _defaultChage: function () {
        if (this.props.action.enable) {
            ActionsActions.updateActionDefault(this.props.action.id);
        }
    }
});

module.exports = ActionListItem;
