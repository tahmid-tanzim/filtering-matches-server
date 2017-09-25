'use strict';

var path = require('path');
var express = require('express');
var controllers = require(path.join(__dirname, 'controllers'));
var api = express.Router();

/* ====================================================== */

// Middleware
var isValidQuery = function (req, res, next) {
    var errors = [];

    // Validate 'has_photo', 'in_contact', 'favourite'
    ['has_photo', 'in_contact', 'favourite'].forEach(function (item) {
        if (req.query.hasOwnProperty(item)) {
            if (req.query[item] === 'true') {
                req.query[item] = true;
            } else if (req.query[item] === 'false') {
                req.query[item] = false;
            } else {
                errors.push('Invalid ' + item);
            }
        }
    });

    // Validate 'age', 'height', 'compatibility_score'
    [
        {name: 'age', min: 18, max: 95},
        {name: 'height', min: 135, max: 210},
        {name: 'compatibility_score', min: 1, max: 99}
    ]
        .forEach(function (item) {
            if (req.query.hasOwnProperty(item.name)) {
                if (Object.prototype.toString.call(req.query[item.name]) === '[object Array]' && req.query[item.name].length === 2) {
                    var x = parseInt(req.query[item.name][0]);
                    var y = parseInt(req.query[item.name][1]);

                    if (x >= item.min && x <= item.max && y >= item.min && y <= item.max) {
                        req.query[item.name] = [Math.min(x, y), Math.max(x, y)];
                    } else {
                        errors.push('Invalid ' + item.name + ' range');
                    }
                } else {
                    errors.push('Invalid ' + item.name + ' data types');
                }
            }
        });

    // Validate 'distance_index'
    if (req.query.hasOwnProperty('distance_index')) {
        var x = parseInt(req.query['distance_index']);

        if (x >= 0 && x <= 2) {
            req.query['distance_index'] = x;
        } else {
            errors.push('Invalid distance_index');
        }
    }

    return errors.length ? res.status(400).json({messages: errors}) : next();
};

/* ====================================================== */

// User endpoints
api.get('/person', isValidQuery, controllers.persons.get);

/* ====================================================== */

module.exports = api;