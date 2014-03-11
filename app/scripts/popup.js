'use strict';

var background_page = chrome.extension.getBackgroundPage();
var current_tab;
var input;

function addActions(){
    input = document.getElementById('url');
    
    // load action itme from localstorage
    var actions = JSON.parse(localStorage.getItem('actions'));
    
    var action_element = document.getElementById('actions');
    var frag = document.createDocumentFragment();
    
    for (var key in actions) {
        var action = actions[key];
        
        var anchor = document.createElement('a');
        anchor.setAttribute('href', '#');
        anchor.setAttribute('id', action.id);
        anchor.setAttribute('class', 'list-group-item');
        anchor.addEventListener('click', function (e) {
            var id;
            if(e.target.tagName === 'A')
                id = e.target.id;
            if(e.target.tagName === 'H5')
                id =e.target.parentNode.id;
            if(e.target.tagName === 'SMALL')
                id =e.target.parentNode.parentNode.id;
            
            background_page.copyToClipboard(current_tab, id, function(result){
                if(result.status != 'err'){
                    input.value = result.message;
                    input.select();
                    document.execCommand('copy', false, null);                    
                }
                background_page.showCopyMessage(result);
            });
            
            window.close();
        }, false);
        
        var h5 = document.createElement('h5');
        h5.innerHTML = action.name;
                
        var small = document.createElement('small');
        small.innerHTML = action.small || '';
        
        if(action.small)
            h5.appendChild(small);
        
        anchor.appendChild(h5);
        
        frag.appendChild(anchor);
    }
    
    action_element.appendChild(frag);
}

function showCopyMessage(){
    var myTimer = function(){setTimeout(doStuff, 1000)};
}

function init()
{
	chrome.tabs.getSelected(null, function(tab) 
	{
		current_tab = tab;
	});
    
    addActions();
}

document.addEventListener('DOMContentLoaded', function () 
{
	init();
});