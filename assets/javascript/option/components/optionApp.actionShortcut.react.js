var React = require('react');
var $ = require('jquery');


/* shortcut */


var ActionShortcut = React.createClass({

    getInitialState: function () {
        return {commandShortcut: {}};
    },

    componentDidMount: function () {
        $('.ui.checkbox').checkbox();

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

    render: function () {
        return (
            <div>

                <h5 className="ui header">Keyboard Shortcut</h5>

                <div className="ui form">
                    <div className="field">
                        <div className="ui toggle checkbox">
                            <input id="shortcut" type="radio" name="shortcut"/>
                            <label>Enabled Shortcut copy feature.</label>
                        </div>
                    </div>

                    <div className="field read-only disabled">
                        <input type="text" value={this.state.commandShortcut}/>
                    </div>
                </div>

                <div className="ui message">
                    <p>
                        You can modify shortcut in&nbsp;
                        <a href="chrome://extensions/#footer-section" onClick={this._openKeyboardSetting}>Keyboard shortcuts</a>
                    &nbsp;in the bottom of Chrome extension. extension default shortcut is Alt+Shift+C. It will be empty if you have been setup it up with other feature.
                    </p>
                </div>

            </div>
        )
    },

    _openKeyboardSetting: function () {
        chrome.tabs.create({
            url: 'chrome://extensions/#footer-section'
        })
    }


});

module.exports = ActionShortcut;
