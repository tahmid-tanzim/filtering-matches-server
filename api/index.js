'use strict';

var path = require('path');
var express = require('express');
var controllers = require(path.join(__dirname, 'controllers'));
var api = express.Router();

/* ====================================================== */

// User endpoints
api.get('/person', controllers.persons.get);

/* ====================================================== */

module.exports = api;