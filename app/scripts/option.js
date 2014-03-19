'use strict';

var background_page = chrome.extension.getBackgroundPage();

function optionCtrl($scope){

    // load actions and patter from localstorage
    $scope.actions = JSON.parse(localStorage.getItem('actions'));
    $scope.pattern = localStorage.getItem('pattern');
    
    $scope.url = 'https://www.google.com';
    $scope.shoternUrl = 'http://goo.gl/Njku';
    $scope.title = 'Google';
    
    $scope.preview = function(action){
        var regexTitle=/title/gi;
        var regexUrl=/url/gi;
        
        switch (action.id) {
                case 'copyTitle':
                    return $scope.title
                    break;
                case 'copyTitleUrl':
                    var r = $scope.pattern.replace(regexUrl, $scope.url);
                    r = r.replace(regexTitle, $scope.title);
                    return r;                
                    break;
                case 'copyTitleUrlShorten':
                     var r = $scope.pattern.replace(regexUrl, $scope.shoternUrl);
                    r = r.replace(regexTitle, $scope.title);
                    return r;    
                    break;
                case 'copyUrlShorten':
                    return $scope.shoternUrl;
                    break;
                case 'copyUrl':
                    return $scope.url;
                    break;
            }    
    };
    
    $scope.$watch('pattern', function(n,o){
        if(n===o)return;
        background_page.update(n);
    });

    $scope.resetDefault = function(){
        background_page.resetDefault();
        
         //re-load actions and patter from localstorage
        $scope.actions = JSON.parse(localStorage.getItem('actions'));
        $scope.pattern = localStorage.getItem('pattern');
    };
}

optionCtrl.$inject = ['$scope'];