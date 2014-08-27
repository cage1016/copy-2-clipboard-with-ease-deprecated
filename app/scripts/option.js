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
}

optionCtrl.$inject = ['$scope'];