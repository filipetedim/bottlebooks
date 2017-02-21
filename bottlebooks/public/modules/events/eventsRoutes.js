'use strict';

var bottlebooksApp = angular.module('bottlebooksApp');

bottlebooksApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/events', {
            controller: 'EventsController',
            templateUrl: 'modules/events/eventsView.html',
            resolve: {
                permission: ['RolesFactory', function (RolesFactory) {
                    return RolesFactory.isLogged();
                }]
            }
        })
        .when('/events/add', {
            controller: 'EventAddController',
            templateUrl: 'modules/events/add/eventAddView.html',
            resolve: {
                permission: ['RolesFactory', function (RolesFactory) {
                    return RolesFactory.isLogged();
                }]
            }
        })
        .when('/events/:eventId', {
            controller: 'EventController',
            templateUrl: 'modules/events/event/eventView.html',
            resolve: {
                permission: ['RolesFactory', function (RolesFactory) {
                    return RolesFactory.isLogged();
                }]
            }
        })
        .otherwise({redirectTo: '/'});
}]);
