'use strict';

var cb = chrome.browserAction;
var url = 'https://www.googleapis.com/urlshortener/v1/url';
var key = 'AIzaSyCWf9RZIACRWqEyfgjE7OY_c0o46D97WfA';
var timer = null;
var milliseconds = 10000;
var statusColor = {
    err: {
        color: '#ff4c62'
    },
    ok: {
        color: '#3c763d'
    }
};

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
    id: 'copyTitleUrlShorten',
    name: 'url (title)',
    small: ' Shorten',
    description: 'copy tab title with Shorten url'
    }, {
    id: 'copyUrlShorten',
    name: 'url',
    small: ' Shorten',
    description: 'copy tab Shorten url'
    },{
    id: 'copyUrl',
    name: 'url',
    description: 'copy tab url'
    }];

function first_init(){    
    var old_pattern = localStorage.getItem('pattern');
    update(old_pattern || pattern);              
}

function update(_pattern){
    localStorage.setItem('pattern', _pattern);
    for(var i in actions){
        var action = actions[i];
        if(action.id === 'copyTitleUrl' || action.id === 'copyTitleUrlShorten')
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
    
    if(!localStorage.getItem('version'))
    {
        console.log('version does not exist');
        first_init();
    }else{
        if(localStorage.version > details.previousVersion)
        {
            // update
            console.log('version update, data migration.');
            first_init();
        }
    }
    
    localStorage.setItem('version', details.previousVersion); 
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
					
				callback({status: 'err', message: response.error.message});
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
    
    // show badge text, color
    cb.setBadgeText({text:'...'});
    cb.setBadgeBackgroundColor(statusColor.ok);
        
    switch (actionId) {
        case 'copyTitle':
            console.log('copy text = ' + tab.title);
            showCopyMessage({message:tab.title,status:'ok'});
            break;
        case 'copyTitleUrl':              
            var text = _pattern.name.replace(regexUrl, tab.url).replace(regexTitle, tab.title);
            console.log('copy text = ' + text);
            showCopyMessage({message:text, status:'ok'});
            break;
        case 'copyTitleUrlShorten':              
            shortenUrl(tab.url, tab.incognito, function (response) {
                if (response.status != 'err') {
                    var text =  _pattern.name.replace(regexUrl, response.message).replace(regexTitle, tab.title);                
                    console.log('copy text = ' + text);
                    showCopyMessage({message:text, status:'ok'});
                }else{
                    console.log('err = '+response.message);
                    showCopyMessage({message:response.message, status:response.status});
                }
            });
            break;
        case 'copyUrlShorten':
            shortenUrl(tab.url, tab.incognito, function (response) {
                if (response.status != 'err') {
                    console.log('copy text = ' + response.message);
                    showCopyMessage({message:response.message, status:'ok'});
                }else{
                    console.log('err = '+response.message);
                    showCopyMessage({message:response.message, status:response.status});
                }
            });
            break;
        case 'copyUrl':
            console.log('copy text = ' + tab.url);
            showCopyMessage({message:tab.url, status:'ok'});
            break;
    }
}

function copy(text){
    var copyDiv = document.createElement('div');
    copyDiv.contentEditable = true;
    document.body.appendChild(copyDiv);
    copyDiv.innerHTML = text;
    copyDiv.unselectable = "off";
    copyDiv.focus();
    document.execCommand('SelectAll');
    document.execCommand("Copy", false, null);
    document.body.removeChild(copyDiv);        
}

function showCopyMessage(result){            
    if(result.status == 'err')
        cb.setBadgeBackgroundColor(statusColor.err);
    else{
        cb.setBadgeBackgroundColor(statusColor.ok);
        copy(result.message);
    }
    
    cb.setBadgeText({text:result.status});
    setTimeout(function() { 
        cb.setBadgeText({text:''});
    }, 500);
}


function createContextMenu() { 
    chrome.contextMenus.removeAll();
    var dActions = JSON.parse(localStorage.getItem('actions'));
    
    for (var i in dActions) {
        var action = actions[i];    
        (function (action) {
            chrome.contextMenus.create({
                'title': action.description,
                'contexts': ['page', 'link', 'selection', 'image'],
                'onclick': function (info, tab) {
                    copyToClipboard(tab, action.id);
                }
            });
        })(action);
    } 
}

function init()
{
	createContextMenu();
}

document.addEventListener('DOMContentLoaded', function () 
{
	init();
});

// google analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-37047744-3', 'blogpost.com');
ga('send', 'pageview');