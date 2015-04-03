'use strict';

var rollingLog = [];

function log(message) {
    var line;
    if (message instanceof Object || message instanceof Array) {
        line = message;
    } else {
        line = new Date().toLocaleString() + ' - ' + message;
    }

    console.log(line);
    rollingLog.push(JSON.stringify(line));

    if (rollingLog.length > 200) {
        rollingLog.shift();
    }
}

module.exports = log;
