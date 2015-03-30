var React = require('react');
var ActionsActions = require('../actions/actionsActions');

var cx = require('react/lib/cx');

var ActionListItem = React.createClass({

    render: function () {
        return (
            <tr className={cx({
                'positive': this.props.action.default
            })}>
                <td>
                    <label>{this.props.action.description}</label>
                </td>
                <td className={cx({
                    'read-only disabled': this.props.action.default
                })}>
                    <input type="checkbox" checked={this.props.action.enable} onChange={this._enableChange} />
                </td>
                <td>
                    <input type="radio" name='default' checked={this.props.action.default} onChange={this._defaultChage} />
                </td>
            </tr>
        )
    },

    _enableChange: function (event) {
        ActionsActions.setActionEnable(this.props.action.id, !this.props.action.enable);
    },

    _defaultChage: function (event) {
        if (this.props.action.enable) {
            ActionsActions.updateActionDefault(this.props.action.id);
        }
    }
});

module.exports = ActionListItem;
