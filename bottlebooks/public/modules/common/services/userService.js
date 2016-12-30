'use strict';

var userService = angular.module('common.services', []);

userService.service('UserService', [
   '$http', 'API_ADDR', 'TokenFactory', 'RolesFactory',
    function ($http, API_ADDR, TokenFactory, RolesFactory) {

        this.login = function (email, password) {
            email = email.toLowerCase();

            return $http({
                method: 'POST',
                url: API_ADDR + '/users/login',
                headers: {
                    Authorization: 'Bearer ' + window.btoa(email + ':' + password)
                }
            });
        }
    }]);
