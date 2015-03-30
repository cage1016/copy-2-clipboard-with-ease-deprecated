var React = require('react');

var ActionsListItem = require('./optionApp.actionListItem.react');

var ActionList = React.createClass({

    render: function () {

        var allActions = this.props.actions;
        var actions = [];

        for (var key in allActions) {
            actions.push(<ActionsListItem key={key} action={allActions[key]} />);
        }

        return (
            <div>
                <a className="ui teal ribbon label">Actions Setup</a>
                <p>
                    <table className="ui table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Enable</th>
                                <th>Default Shortcut</th>
                            </tr>
                        </thead>
                        <tbody>
                        {actions}
                        </tbody>
                    </table>
                </p>
            </div>
        )
    }


});

module.exports = ActionList;