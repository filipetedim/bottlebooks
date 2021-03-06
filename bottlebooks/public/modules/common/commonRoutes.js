'use strict';

var bottlebooksApp = angular.module('bottlebooksApp');

bottlebooksApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'LoginController',
            templateUrl: 'modules/common/login/loginView.html',
            resolve: {
                permission: ['RolesFactory', function (RolesFactory) {
                    return RolesFactory.isNotLogged();
                }]
            }
        })
        .when('/register', {
            controller: 'RegisterController',
            templateUrl: 'modules/common/register/registerView.html',
            resolve: {
                permission: ['RolesFactory', function (RolesFactory) {
                    return RolesFactory.isNotLogged();
                }]
            }
        })
        .when('/activate/:userId', {
            controller: 'ActivateController',
            templateUrl: 'modules/common/activate/activateView.html',
            resolve: {
                permission: ['RolesFactory', function (RolesFactory) {
                    return RolesFactory.isNotLogged();
                }]
            }
        })
        .otherwise({redirectTo: '/'});
}]);