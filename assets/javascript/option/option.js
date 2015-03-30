/** @jsx React.DOM */

var React = require('react');
var OptionApp = require('./components/optionApp.js');

//var bg = chrome.extension.getBackgroundPage();



document.addEventListener('DOMContentLoaded', function () {
    React.render(
        <OptionApp/>,
        document.getElementById('app')
    );
});
