'use strict';

var tokenRequest = angular.module('common.factories');

tokenRequest.factory('TokenFactory', [
    'localStorageService', '$http', 'LogoutFactory', 'TOKEN_VERSION',
    function (localStorageService, $http, LogoutFactory, TOKEN_VERSION) {

        /**
         * Sends a token with a x-access-token header.
         * If the token version doesn't match the constant tkoen version, log out the user.
         *
         * @param {String} method - POST, GET, PUT, DELETE
         * @param {String} url - the api url to connect to
         * @param {Object} data - the content
         * @return {Object} - an http promise
         */
        function sendWithToken(method, url, data) {
            if (localStorageService.get('TOKEN_VERSION') !== TOKEN_VERSION) {
                LogoutFactory.logout();
            }

            var request = {
                method: method,
                url: url,
                headers: {
                    'x-access-token': localStorageService.get('token')
                }
            };
            
            if (exists(data)) {
                request.data = data;
            }

            return $http(request);
        }

        return {sendWithToken: sendWithToken};
    }]);