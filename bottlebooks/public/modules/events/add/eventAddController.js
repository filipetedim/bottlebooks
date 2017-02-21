'use strict';

var eventAdd = angular.module('events');

eventAdd.controller('EventAddController', [
    '$scope', 'LogoutFactory', 'EventsService', '$location',
    function ($scope, LogoutFactory, EventsService, $location) {

        /**
         * Initializes the controller.
         */
        var init = function () {
        };

        /**
         * Creates an event.
         *
         * Checks if the form is valid. Then checks if the date is valid.
         * If both are, creates the event.
         *
         * @param {Boolean} valid - form validity
         */
        $scope.createEvent = function (valid) {
            if (!valid) {
                return;
            }

            // Checking if date is valid, empties input if it isn't
            var date = moment($scope.eventData.date, 'DD/MM/YYYY');
            if (!date.isValid()) {
                $scope.eventData.date = "";
                return;
            }

            var eventData = angular.copy($scope.eventData);
            eventData.date = date.format('x');

            EventsService.createEvent(eventData).then(function () {
                $scope.href('/events');
            }, function (err) {
                // TODO err handling
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
