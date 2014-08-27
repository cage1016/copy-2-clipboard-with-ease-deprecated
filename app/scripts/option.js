'use strict';

var bg = chrome.extension.getBackgroundPage();

function optionCtrl($scope) {

    // load actions and patter from localstorage
    $scope.actions = JSON.parse(localStorage.getItem('actions'));
    $scope.pattern = localStorage.getItem('pattern');

    $scope.url = 'https://www.google.com';
    $scope.shoternUrl = 'http://goo.gl/Njku';
    $scope.title = 'Google';

    $scope.preview = function(action) {
        var regexTitle = /title/gi;
        var regexUrl = /url/gi;
        var result = null;

        switch (action.id) {
            case 'copyTitle':
                result = $scope.title;
                break;
            case 'copyTitleUrl':
                result = $scope.pattern.replace(regexUrl, $scope.url).replace(regexTitle, $scope.title);
                break;
            case 'copyTitleUrlShorten':
                result = $scope.pattern.replace(regexUrl, $scope.shoternUrl).replace(regexTitle, $scope.title);
                break;
            case 'copyUrlShorten':
                result = $scope.shoternUrl;
                break;
            case 'copyUrl':
                result = $scope.url;
                break;
        }

        return result;
    };

    $scope.$watch('pattern', function(n, o) {
        if (n === o) {
            return;
        }
        bg.update(n);
    });

    $scope.resetDefault = function() {
        bg.resetDefault();

        //re-load actions and patter from localstorage
        $scope.actions = JSON.parse(localStorage.getItem('actions'));
        $scope.pattern = localStorage.getItem('pattern');
    };

    /* shortcut */
    chrome.commands.getAll(function(commands) {
        angular.forEach(commands, function(command) {
            if (command.name === 'trigger-fast-copy') {
                $scope.commandShortcut = command.shortcut;
                $scope.$apply();
            }
        });
    });

    $scope.shortcut = JSON.parse(localStorage.getItem('shortcut'));

    $scope.$watch('shortcut', function(n, o) {
        if (n === o) {
            return;
        }
        localStorage.setItem('shortcut', JSON.stringify(n));
    }, true);


    $scope.open = function() {
        chrome.tabs.create({
            url: 'chrome://extensions/'
        }, function() {

        });
    };
}

optionCtrl.$inject = ['$scope'];