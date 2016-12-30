'use strict';

var logoutFactory = angular.module('common.factories');

logoutFactory.factory('LogoutFactory', [
    '$location', 'RolesFactory',
    function ($location, RolesFactory) {

        var logout = function (redirect) {
            // Default true
            redirect = redirect || true;

            // Clear all roles
            RolesFactory.clearAll();

            // Redirect
            if (redirect) {
                $location.path('/logout');
            }
        }

        return {logout: logout};
    }]);