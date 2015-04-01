var React = require('react');

var current_tab;
chrome.tabs.getSelected(null, function (tab) {
    current_tab = tab;
});

var ActionListItem = React.createClass({

    getInitialState: function () {
        return {
            bg: chrome.extension.getBackgroundPage()
        }
    },

    render: function () {
        var small = null, _default = null;
        if (this.props.action.small) {
            small = <span className="shorten">Shorten</span>;
        }
        if (this.props.action.default && this.props.shortcutEnabled) {
            _default = <i className="star icon"></i>;
        }

        return (
            <div className="fluid ui button action-item" onClick={this._onClick}>{_default} {this.props.action.name} {small}</div>
        )
    },

    _onClick: function () {
        this.state.bg.copyHandler(current_tab, this.props.action.id);
        window.close();
    }
});

module.exports = ActionListItem;
