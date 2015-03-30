/** @jsx React.DOM */

var bg = chrome.extension.getBackgroundPage();

var React = require('react');

var PatternStore = require('../stores/patternStore');
var ActionsStore = require('../stores/actionsStore');

var PatternInput = require('./optionApp.patternInput.react');
var ActionList = require('./optionApp.actionList.react');
var ActionPreview = require('./optionApp.actionPreview.react');

var ActionsActions = require('../actions/actionsActions');
var PatternActions = require('./../actions/paternActions');

function getStateFromStores() {
    return {
        pattern: PatternStore.get(),
        actions: ActionsStore.getAll(),
        previewData: JSON.parse(localStorage.getItem('cp2')).previewData
    };
}

var optionApp = React.createClass({

    getInitialState: function () {
        return getStateFromStores();
    },

    componentDidMount: function () {
        PatternStore.addChangeListener(this._onChange);
        ActionsStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        PatternStore.removeChangeListener(this._onChange);
        ActionsStore.removeChangeListener(this._onChange);
    },

    render: function () {
        return (
            <div>
                <div className="ui raised segment">
                    <PatternInput pattern={this.state.pattern} previewData={this.state.previewData}/>
                    <ActionPreview actions={this.state.actions} previewData={this.state.previewData}/>
                    <ActionList actions={this.state.actions}/>
                </div>
                <div className="ui purple button" onClick={this._resetSetting}>Reset Settigns</div>
            </div>
        );
    },

    /**
     * Event handler for 'change' events coming from the TodoStore
     */
    _onChange: function () {
        this.setState(getStateFromStores());
    },

    _resetSetting: function(){
        ActionsActions.resetAction();
        PatternActions.resetPattern();
    }
});

module.exports = optionApp;
