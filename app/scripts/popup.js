'use strict';

var bg = chrome.extension.getBackgroundPage();
var currentTab;

function addActions() {
    // load action itme from localstorage
    var actions = JSON.parse(localStorage.getItem('actions'));

    var actionElement = document.getElementById('actions');
    var frag = document.createDocumentFragment();

    var clickHandler = function(e) {
        var id;
        if (e.target.tagName === 'A') {
            id = e.target.id;
        }
        if (e.target.tagName === 'H5') {
            id = e.target.parentNode.id;
        }
        if (e.target.tagName === 'SMALL') {
            id = e.target.parentNode.parentNode.id;
        }

        bg.copyToClipboard(currentTab, id);
        window.close();
    };

    for (var key in actions) {
        var action = actions[key];

        var anchor = document.createElement('a');
        anchor.setAttribute('href', '#');
        anchor.setAttribute('id', action.id);
        anchor.setAttribute('class', 'list-group-item');
        anchor.addEventListener('click', clickHandler, false);

        var h5 = document.createElement('h5');
        h5.innerHTML = action.name;

        var small = document.createElement('small');
        small.innerHTML = action.small || '';

        if (action.small) {
            h5.appendChild(small);
        }

        anchor.appendChild(h5);

        frag.appendChild(anchor);
    }

    actionElement.appendChild(frag);
}

function init() {
    chrome.tabs.getSelected(null, function(tab) {
        currentTab = tab;
    });

    addActions();
}

document.addEventListener('DOMContentLoaded', function() {
    init();
});