'use strict';

var cb = chrome.browserAction;
var url = 'https://www.googleapis.com/urlshortener/v1/url';
var key = 'AIzaSyCWf9RZIACRWqEyfgjE7OY_c0o46D97WfA';
var timer = null;
var milliseconds = 10000;

// initial value
var pattern = 'url (title)';
var actions = [{
    id: 'copyTitle',
    name: 'title',
    description: 'copy tab title'
    }, {
    id: 'copyTitleUrl',
    name: 'url (title)',
    description: 'copy tab title with url'
    }, {
    id: 'copyTitleUrlShortern',
    name: 'url (title)',
    small: ' Shortern',
    description: 'copy tab title with shortern url'
    }, {
    id: 'copyUrl',
    name: 'url',
    small: ' Shortern',
    description: 'copy tab shortern url'
    }];

function first_init(){    
    update(pattern);
}

function update(_pattern){
    localStorage.setItem('pattern', _pattern);
    for(var i in actions){
        var action = actions[i];
        if(action.id === 'copyTitleUrl' || action.id === 'copyTitleUrlShortern')
            action.name = _pattern;
    }
    localStorage.setItem('actions', JSON.stringify(actions));
}

function resetDefault(){
    first_init();
}

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);    
    console.log('first data initialize');
    first_init();
});

function shortenUrl(longUrl, incognito, callback)
{	
	var	xmlhttp = new XMLHttpRequest();
	xmlhttp.open('POST', url + '?key=' + key, true);
	xmlhttp.setRequestHeader('Content-Type', 'application/json');	
	
	xmlhttp.onreadystatechange = function()
	{
		if(xmlhttp.readyState == 4 && xmlhttp.status != 0) 
		{
			clearTimeout(timer);

			var response = JSON.parse(xmlhttp.responseText);

			if(response.id == undefined)
			{
				if(response.error.code == '401')
					oauth.clearTokens();
					
				callback({status: 'error', message: response.error.message});
			}
			else	
			{
				callback({status: 'success', message: response.id});
			}
		}
	}

	xmlhttp.send(JSON.stringify({'longUrl': longUrl}));
	
	timer = setTimeout(function()
	{
		xmlhttp.abort();
		callback({status: 'error', message: chrome.i18n.getMessage('timeout_occurred')});
	}
	, milliseconds);
}

var regexTitle=/title/gi;
var regexUrl=/url/gi;    
function copyToClipboard(tab, actionId, callback){ 
    
    var _pattern = (function(id){
        var r;
        for(var i in JSON.parse(localStorage.getItem('actions'))){
            var action = actions[i];
            if(action.id === actionId)
                r = action;
        }
        return r;
    })(actionId);
    
    switch (actionId) {
        case 'copyTitle':
            console.log('copy text = ' + tab.title);
            callback({message:tab.title,status:'ok'});
            break;
        case 'copyTitleUrl':              
            var text = _pattern.name.replace(regexUrl, tab.url).replace(regexTitle, tab.title);
            console.log('copy text = ' + text);
            callback({message:text, status:'ok'});
            break;
        case 'copyTitleUrlShortern':
            shortenUrl(tab.url, tab.incognito, function (response) {
                if (response.status != 'err') {
                    var text =  _pattern.name.replace(regexUrl, response.message).replace(regexTitle, tab.title);                
                    console.log('copy text = ' + text);
                    callback({message:text, status:'ok'});
                }else{
                    console.log('err = '+response.message);
                    callback({message:response.message, status:response.status});
                }
            });
            break;
        case 'copyUrl':
            shortenUrl(tab.url, tab.incognito, function (response) {
                if (response.status != 'err') {
                    console.log('copy text = ' + response.message);
                    callback({message:response.message, status:'ok'});
                }else{
                    console.log('err = '+response.message);
                    callback({message:response.message, status:response.status});
                }
            });
            break;
    }
}

function showCopyMessage(result){
    if(result.status != 'err')
        cb.setBadgeBackgroundColor({color:'#3c763d'});
    else
        cb.setBadgeBackgroundColor({color:'#ff4c62'});
    
    cb.setBadgeText({text:result.status});
    setTimeout(function() { 
        cb.setBadgeText({text:''});
    }, 1000);
}

function init()
{
	//createContextMenu();
}

document.addEventListener('DOMContentLoaded', function () 
{
	init();
});