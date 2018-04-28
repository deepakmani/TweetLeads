'use strict';
var app = app;

app.factory('Session', function ($resource) {
    return $resource('/auth/session/');
});