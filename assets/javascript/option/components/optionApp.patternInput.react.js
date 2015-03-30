var React = require('react');
var PatternActions = require('./../actions/paternActions');

var PatternInput = React.createClass({

    //getInitialState: function () {
    //    return {
    //        pattern: this.props.pattern || ''
    //    };
    //},

    render: function () {
        return (
            <div>
                <a className="ui teal ribbon label">Pattern and Preview</a>
                <p>
                    <div className="ui form">
                        <div className="field">
                            <label>Pattern</label>
                            <input
                                type="text"
                                onChange={this._onChange}
                                value={this.props.pattern} />
                        </div>
                        <div className="field">
                            <label>Url</label>
                            <input value={this.props.previewData.URL} disabled="disabled"/>
                        </div>
                        <div className="field">
                            <label>Title</label>
                            <input value={this.props.previewData.TITLE} disabled="disabled"/>
                        </div>
                    </div>
                </p>
            </div>
        )
    },

    _onChange: function (/*object*/ event) {
        PatternActions.updatePattern(event.target.value);
        //this.setState({
        //    pattern: event.target.value
        //});
    }

});

module.exports = PatternInput;
