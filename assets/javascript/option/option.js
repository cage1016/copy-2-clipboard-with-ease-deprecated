/** @jsx React.DOM */

'use strict';

var React = require('react');
var OptionApp = require('./components/optionApp.js');

document.addEventListener('DOMContentLoaded', function () {
    React.render(
        <OptionApp/>,
        document.getElementById('app')
    );
});
