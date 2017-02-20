'use strict';

var rolesModule = angular.module('common.factories', []);

rolesModule.factory('RolesFactory', [
    '$q', '$rootScope', '$location', 'localStorageService',
    function ($q, $rootScope, $location, localStorageService) {

        /**
         * Clears all the local storage and the user permissions.
         */
        var clearAll = function () {
            localStorageService.clearAll();
        };

        /**
         * Checks if a user is not logged
         * @returns {*}
         */
        var isNotLogged = function () {
            var deferred = $q.defer();

            if (exists(localStorageService.get('token')) && exists(localStorageService.get('id'))) {
                $location.path('/events');
                $rootScope.$on('$locationChangeSuccess', function () {
                    deferred.resolve();
                });
            } else {
                deferred.resolve();
            }

            return deferred.promise;
        };

        var isLogged = function () {
            var deferred = $q.defer();

            if (exists(localStorageService.get('token')) && exists(localStorageService.get('id'))) {
                deferred.resolve();
            } else {
                clearAll();
                $location.path('/');
                $rootScope.$on('$locationChangeSuccess', function () {
                    deferred.resolve();
                });
            }

            return deferred.promise;
        };
        
        var setLocalStorage = function (user) {
            localStorageService.set('id', user._id);
            localStorageService.set('token', user.token);
            localStorageService.set('TOKEN_VERSION', user.TOKEN_VERSION);
            localStorageService.set('name', user.name);
            localStorageService.set('email', user.email);
        };

        return {
            clearAll: clearAll,
            isNotLogged: isNotLogged,
            setLocalStorage: setLocalStorage,
            isLogged: isLogged
        }
    }]);
