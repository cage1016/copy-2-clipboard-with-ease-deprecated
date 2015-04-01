/** @jsx React.DOM */

var bg = chrome.extension.getBackgroundPage();

var React = require('react');

var PatternStore = require('../stores/patternStore');
var ActionsStore = require('../stores/actionsStore');
var ShortcutStateStore = require('../stores/shortcutStateStore');

var PatternInput = require('./optionApp.patternInput.react');
var ActionList = require('./optionApp.actionList.react');
var ActionPreview = require('./optionApp.actionPreview.react');
var ActionShortcut = require('./optionApp.actionShortcut.react');

var ActionsActions = require('../actions/actionsActions');
var PatternActions = require('./../actions/paternActions');
var ShortcutStateActions = require('./../actions/shortcutStateActions');

function getStateFromStores() {
    return {
        pattern: PatternStore.get(),
        actions: ActionsStore.getAll(),
        previewData: JSON.parse(localStorage.getItem('cp2')).previewData,
        shortcutEnabled: ShortcutStateStore.get()
    };
}

var optionApp = React.createClass({

    getInitialState: function () {
        return getStateFromStores();
    },

    componentDidMount: function () {
        PatternStore.addChangeListener(this._onChange);
        ActionsStore.addChangeListener(this._onChange);
        ShortcutStateStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        PatternStore.removeChangeListener(this._onChange);
        ActionsStore.removeChangeListener(this._onChange);
        ShortcutStateStore.removeChangeListener(this._onChange);
    },

    render: function () {
        return (
            <div>
                <div className="ui raised segment">
                    <div>
                        <a className="ui teal ribbon label">Pattern and Preview</a>
                        <p>
                            <PatternInput pattern={this.state.pattern} previewData={this.state.previewData}/>
                            <ActionPreview actions={this.state.actions} previewData={this.state.previewData}/>
                        </p>
                        <a className="ui teal ribbon label">Actions Setup</a>
                        <p>
                            <ActionShortcut shortcutEnabled={this.state.shortcutEnabled}/>
                            <ActionList actions={this.state.actions} shortcutEnabled={this.state.shortcutEnabled}/>
                        </p>
                    </div>
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

    _resetSetting: function () {
        ActionsActions.resetAction();
        PatternActions.resetPattern();
        ShortcutStateActions.resetShortcutState();
    }
});

module.exports = optionApp;
