'use strict';

var url = 'https://www.googleapis.com/urlshortener/v1/url';
var key = 'AIzaSyCWf9RZIACRWqEyfgjE7OY_c0o46D97WfA';
var timer = null;
var milliseconds = 10000;

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
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

function copyToClipboard(tab, actionId){    
    switch (actionId) {
        case 'copyTitle':
            copy(tab.title);
            break;
        case 'copyTitleUrl':
            var text = (tab.url + ' (' + tab.title + ')');
            copy(text);
            break;
        case 'copyTitleUrlShortern':
            shortenUrl(tab.url, tab.incognito, function (response) {
                if (response.status != 'error') {
                    var text = (response.message + ' (' + tab.title + ')');
                    copy(text);
                }
            });
            break;
        case 'copyUrl':
            shortenUrl(tab.url, tab.incognito, function (response) {
                if (response.status != 'error') {
                    copy(response.message);
                }
            });
            break;
    }
}

function copy(text)
{
	var input = document.getElementById('url');
	
	if(input == undefined)
		return;
	
	input.value = text;					
	input.select();

    console.log('copy = ' +text);
    
	document.execCommand('copy', false, null);
}

function init()
{
	//createContextMenu();
}

document.addEventListener('DOMContentLoaded', function () 
{
	init();
});