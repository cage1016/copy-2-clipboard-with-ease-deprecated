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

                <div className="ui icon message">
                    <i className="help icon"></i>
                    <div className="content">
                        <div className="header">
                            mention!
                        </div>
                        <p>You can setup copy title url pattern but keep <code><b>title</b></code>&nbsp;<code><b>url</b></code> keyword.</p>
                    </div>
                </div>
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
