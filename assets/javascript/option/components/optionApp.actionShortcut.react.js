var React = require('react');
var $ = require('jquery');

var ShortcutStateActions = require('./../actions/shortcutStateActions');


var ActionShortcut = React.createClass({

    semanticUICheckboxInit: function () {
        if (this.props.shortcutEnabled) {
            $('#shortcut').checkbox('check');
        } else {
            $('#shortcut').checkbox('uncheck');
        }
    },


    getInitialState: function () {
        return {commandShortcut: {}};
    },

    componentDidMount: function () {
        this.semanticUICheckboxInit();

        var that = this;
        chrome.commands.getAll(function (commands) {
            for (var key in commands) {
                var command = commands[key];

                if (command.name === 'trigger-fast-copy') {
                    that.setState({commandShortcut: command.shortcut});
                }
            }
        });
    },

    componentDidUpdate: function () {
        this.semanticUICheckboxInit();
    },

    render: function () {
        return (
            <div>

                <h5 className="ui header">Keyboard Shortcut</h5>

                <div className="ui form">
                    <div className="field">
                        <div id="shortcut" className="ui toggle checkbox" onClick={this._shortcutStateChange}>
                            <input type="radio" name="shortcut"/>
                            <label>Enabled Shortcut copy feature.</label>
                        </div>
                    </div>

                    <div className="field read-only disabled">
                        <input type="text" value={this.state.commandShortcut}/>
                    </div>
                </div>

                <div className="ui icon message">
                    <i className="help icon"></i>
                    <div className="content">
                        <div className="header">
                            mention!
                        </div>
                        <p>
                            You can modify shortcut in&nbsp;
                            <a href="chrome://extensions/#footer-section" onClick={this._openKeyboardSettign}>Keyboard shortcuts</a>
                        &nbsp;in the bottom of Chrome extension. extension default shortcut is Alt+Shift+C. It will be empty if you have been setup it up with other feature.
                        </p>
                    </div>
                </div>

            </div>
        )
    },

    _openKeyboardSettign: function () {
        chrome.tabs.create({
            url: 'chrome://extensions/#footer-section'
        })
    },

    _shortcutStateChange: function () {
        ShortcutStateActions.updateShortcutState(!this.props.shortcutEnabled);
    }
});

module.exports = ActionShortcut;
