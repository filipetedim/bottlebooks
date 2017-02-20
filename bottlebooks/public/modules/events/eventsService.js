'use strict';

var eventsService = angular.module('events', []);

eventsService.service('EventsService', [
    '$http', 'TokenFactory',
    function ($http, TokenFactory) {

        var API_ADDR = 'http://95.85.37.131:3000/v1';

        this.getAllEvents = function () {
            return TokenFactory.sendWithToken('GET', API_ADDR + '/events');
        };

        this.getEvent = function (_eventId) {
            return TokenFactory.sendWithToken('GET', API_ADDR + '/events/' + _eventId);
        };

        this.participate = function (_eventId) {
            return TokenFactory.sendWithToken('GET', API_ADDR + '/events/participate?_eventId=' + _eventId);
        };

        this.createEvent = function (data) {
            return TokenFactory.sendWithToken('POST', API_ADDR + '/events', data);
        };
    }]);
