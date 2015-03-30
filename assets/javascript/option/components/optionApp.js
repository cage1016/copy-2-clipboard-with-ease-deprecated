/** @jsx React.DOM */
var React = require('react');
var PatternStore = require('../stores/patternStore');
var PatternInput = require('./optionApp.patternInput.react');


function getPatternStore() {
    return {
        pattern: PatternStore.get()
    };
}

var patternApp = React.createClass({

    getInitialState: function () {
        return getPatternStore();
    },

    componentDidMount: function () {
        PatternStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        PatternStore.removeChangeListener(this._onChange);
    },

    render: function () {
        return (
            <div>
                <PatternInput pattern={this.state.pattern} />
            </div>
        );
    },

    /**
     * Event handler for 'change' events coming from the TodoStore
     */
    _onChange: function () {
        this.setState(getPatternStore());
    }
});

module.exports = patternApp;
