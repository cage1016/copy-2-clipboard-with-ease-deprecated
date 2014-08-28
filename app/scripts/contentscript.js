'use strict';

var lastTarget = null;
document.addEventListener('contextmenu', function(event) {
    var node = event.target;
    while (node && node.nodeName.toLowerCase() !== 'a') {
        node = node.parentNode;
    }
    lastTarget = node;
}, true);


chrome.extension.onRequest.addListener(function(request, sender, callback) {
    if (request === 'copy') {
        callback({
            url: lastTarget.href,
            title: lastTarget.innerText
        });
    }
});