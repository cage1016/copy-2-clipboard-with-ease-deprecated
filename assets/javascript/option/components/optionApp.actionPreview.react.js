var React = require('react');

var regexTitle = /title/gi;
var regexUrl = /url/gi;


var ActionPreview = React.createClass({

    render: function () {

        var allActions = this.props.actions;
        var previewData = this.props.previewData;
        var rows = [];

        for (var key in allActions) {
            var action = allActions[key];
            switch (action.id) {
                case 'copyTitle':
                    action.value = previewData.TITLE;
                    break;
                case 'copyTitleUrl':
                    var r = action.name.replace(regexUrl, previewData.URL);
                    action.value = r.replace(regexTitle, previewData.TITLE);
                    break;
                case 'copyTitleUrlShorten':
                    var r = action.name.replace(regexUrl, previewData.SHOTERNURL);
                    action.value = r.replace(regexTitle, previewData.TITLE);
                    break;
                case 'copyUrlShorten':
                    action.value = previewData.SHOTERNURL;
                    break;
                case 'copyUrl':
                    action.value = previewData.URL;
                    break;
            }


            rows.push(
                <tr>
                    <td>{allActions[key].description}</td>
                    <td>{action.value}</td>
                </tr>
            );
        }

        return (
            <table className="ui table">
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Preview</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }

});

module.exports = ActionPreview;
