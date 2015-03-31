/** @jsx React.DOM */

var React = require('react');
var PopupApp = require('./popupApp');

document.addEventListener('DOMContentLoaded', function () {
    React.render(
        <PopupApp/>,
        document.getElementById('app')
    );
});

