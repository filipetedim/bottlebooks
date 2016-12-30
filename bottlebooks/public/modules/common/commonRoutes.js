'use strict';

var bottlebooksApp = angular.module('bottlebooksApp');

bottlebooksApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'LoginController',
        templateUrl: 'modules/common/login/loginView.html',
        resolve: {
            permission: ['RolesFactory', function (RolesFactory) {
                return RolesFactory.isNotLogged();
            }]
        }
    })
}]);