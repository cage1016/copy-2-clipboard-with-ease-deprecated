var React = require('react');
var PatternActions = require('./../actions/paternActions');

var PatternInput = React.createClass({

    getInitialState: function () {
        return {
            pattern: this.props.pattern || ''
        };
    },

    render: function () {
        return (
            <div>
                <input
                    type="text"
                    onChange={this._onChange}
                    value={this.state.pattern} />
            </div>
        )
    },

    _onChange: function (/*object*/ event) {
        PatternActions.updatePattern(event.target.value);
        this.setState({
            pattern: event.target.value
        });
    }

});

module.exports = PatternInput;
