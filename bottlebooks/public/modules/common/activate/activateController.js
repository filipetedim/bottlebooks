'use strict';

var activate = angular.module('common.activate', []);

activate.controller('ActivateController', [
    '$scope', 'UserService', '$routeParams', 'RolesFactory', '$location', '$route',
    function ($scope, UserService, $routeParams, RolesFactory, $location, $route) {

        /**
         * Initializes the controller.
         */
        var init = function () {
            var _userId = $routeParams.userId;

            UserService.activate(_userId).then(function () {
                $route.reload();
            }, function () {
                // TODO error handling user already applied
                $location.path('/');
            });
        };

        init();
    }]);
