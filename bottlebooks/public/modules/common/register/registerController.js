'use strict';

var register = angular.module('common.register', []);

register.controller('RegisterController', [
    '$scope', 'UserService', '$location',
    function ($scope, UserService, $location) {

        /**
         * Registers the user.
         */
        $scope.submit = function (valid) {
            if (!valid) {
                return;
            }

            var userData = angular.copy($scope.userData);

            UserService.register(userData).then(function () {
                // TODO let user know it was successful somehow
                $location.path('/');
            }, function (err) {
                // TODO handle error
            });
        };
    }]);
