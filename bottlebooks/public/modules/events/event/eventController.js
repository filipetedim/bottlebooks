'use strict';

var event = angular.module('events');

event.controller('EventController', [
    '$scope', 'LogoutFactory', 'EventsService', '$location', '$routeParams',
    function ($scope, LogoutFactory, EventsService, $location, $routeParams) {

        /**
         * Initializes the controller.
         */
        var init = function () {
            var _eventId = $routeParams.eventId;
            EventsService.getEvent(_eventId).then(function (response) {
                $scope.event = response.data;
                $scope.event.date = moment($scope.event.date).format('DD/MM/YYYY');
            }, function (err) {
                // Forbidden access
                if (err.status === 403) {
                    $scope.href('/events');
                }

                // TODO handle other errors
            });
        };

        /**
         * Logs the user out.
         */
        $scope.logout = function () {
            LogoutFactory.logout();
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
