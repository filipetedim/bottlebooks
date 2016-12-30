/**
 * This file is not meant to have anything other than global modules and app dependencies.
 * @type {*|module}
 */
var bottlebooksApp = angular.module('bottlebooksApp',
    [
        'ngRoute', 'LocalStorageModule',
        'common.login',
        'common.factories',
        'common.services',
    ]
);
