'use strict';

var login = angular.module('common.login', []);

login.controller('LoginController', [
    '$scope', 'RolesFactory', 'UserService',
    function ($scope, rolesFactory, UserService) {
        
        // Used to control amount of login requests, to avoid spam
        $scope.locked = false;
        RolesFactory.clearAll();

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
            }, function (err) {
                // TODO rollbar
                // TODO display error on frontend
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
                window.setTimeout(function(){
                    $scope.locked = false;
                }, 500);
            } else {
                $scope.locked = true;
            }
        };
    }]);
