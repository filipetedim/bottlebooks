'use strict';

var events = angular.module('events');

events.controller('EventsController', [
    '$scope', 'LogoutFactory', 'EventsService', '$location', 'localStorageService', '$route',
    function ($scope, LogoutFactory, EventsService, $location, localStorageService, $route) {

        /**
         * Controller variables
         */
        $scope.eventsCreated = [];
        $scope.eventsParticipating = [];
        $scope.events = [];

        /**
         * Initializes the controller.
         */
        var init = function () {
            EventsService.getAllEvents().then(function (response) {
                var events = response.data;

                events.forEach(function (event) {
                    // Make dates readable
                    event.date = moment(event.date).format('DD/MM/YYYY');

                    // Decide to which group the event goes (Created, Participating, AllEvents)
                    if (event.owner._userId === localStorageService.get('id')) {
                        $scope.eventsCreated.push(event);
                    } else if (event.participants.length > 0) {
                        $scope.eventsParticipating.push(event);
                    } else {
                        $scope.events.push(event);
                    }
                });
            });
        };

        /**
         * Opens the a specific event page.
         *
         * @param {String} _eventId - the event id
         */
        $scope.openEvent = function (_eventId) {
            $scope.href('/events/' + _eventId);
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

        /**
         * Adds an user to the event with a given id. The user id is retrieved from the token.
         *
         * @param {String} _eventId - the event id
         */
        $scope.participate = function (_eventId) {
            EventsService.participate(_eventId).then(function () {
                $route.reload();
            }, function (err) {
                // TODO handle err
            });
        };

        init();
    }]);
