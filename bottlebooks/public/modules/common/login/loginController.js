'use strict';

var login = angular.module('common.login', []);

login.controller('LoginController', [
    '$scope', 'RolesFactory', 'UserService', '$location',
    function ($scope, RolesFactory, UserService, $location) {

        // Used to control amount of login requests, to avoid spam
        $scope.locked = false;
        RolesFactory.clearAll();

        /**
         * Run to initialize the controller.
         */
        var init = function () {
            UserService.getPendingUsers().then(function (response) {
                $scope.usersPending = response.data;
            });
        };

        /**
         * Attempt to login the user with the credencials given.
         */
        $scope.login = function () {
            // Do nothing if locked, mising email or password
            if ($scope.locked || !exists($scope.email) || !exists($scope.password)) {
                return;
            }

            // Lock login from here on
            $scope.lockLogin();

            UserService.login($scope.email, $scope.password).then(function (response) {
                RolesFactory.setLocalStorage(response.data);
                $location.path('/events');
            }, function (err) {
                // TODO rollbar
                $scope.loginError = true;
            });

            // Unlock login
            $scope.lockLogin(false);
        };

        /**
         * Locks/Unlocks the login attempt.
         *
         * @param {Boolean} lock - true to unlock, false to unlock, default is true
         */
        $scope.lockLogin = function (lock) {
            lock = lock || true;

            if (lock) {
                window.setTimeout(function () {
                    $scope.locked = false;
                }, 500);
            } else {
                $scope.locked = true;
            }
        };

        /**
         * Redirects to the given location.
         *
         * @param {String} location - the location to move to
         */
        $scope.href = function (location) {
            $location.path(location);
        };

        init();
    }]);
