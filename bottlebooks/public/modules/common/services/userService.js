'use strict';

var userService = angular.module('common.services', []);

userService.service('UserService', [
   '$http', 'TokenFactory',
    function ($http, TokenFactory) {

        var API_ADDR = 'http://95.85.37.131:3000/v1';

        this.login = function (email, password) {
            email = email.toLowerCase();

            return $http({
                method: 'POST',
                url: API_ADDR + '/users/login',
                headers: {
                    Authorization: window.btoa(email + ':' + password)
                }
            });
        };

        this.activate = function (_userId) {
            return TokenFactory.sendWithToken('GET', API_ADDR + '/users/activate?_userId=' + _userId);
        };

        this.getPendingUsers = function () {
            return $http.get(API_ADDR + '/users/pendingusers');
        };

        this.register = function (data) {
            return $http.post(API_ADDR + '/users/register', data);
        }
    }]);
