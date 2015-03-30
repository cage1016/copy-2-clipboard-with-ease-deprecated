function shortenUrl(longUrl, incognito, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', url + '?key=' + key, true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status != 0) {
            clearTimeout(timer);

            var response = JSON.parse(xmlhttp.responseText);

            if (response.id == undefined) {
                if (response.error.code == '401')
                    oauth.clearTokens();

                callback({status: 'err', message: response.error.message});
            }
            else {
                callback({status: 'success', message: response.id});
            }
        }
    }

    xmlhttp.send(JSON.stringify({'longUrl': longUrl}));

    timer = setTimeout(function () {
            xmlhttp.abort();
            callback({status: 'error', message: chrome.i18n.getMessage('timeout_occurred')});
        }
        , milliseconds);
}

module.exports = shortenUrl;
