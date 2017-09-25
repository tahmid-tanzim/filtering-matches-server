'use strict';

var when = require('when');
var matches = require('../models/matches');
var distance = require('../utils/distance');

/* ====================================================== */

/**
 * @api {get} /person Get Person
 * @apiName Get
 * @apiGroup Person
 *
 * @apiQuery {Number} id Person's id
 *
 * @apiSuccess {Number} status HTTP status code (200)
 * @apiSuccess {Object} data retrieved Person object
 */
exports.get = function (req, res) {
    var query = req.query;
    var myCity = {
        lat: 52.412811,
        lon: -1.778197
    };

    var filteredData = matches.matches
            .filter(function (item) {
                if (!query.hasOwnProperty('has_photo')) {
                    return true;
                }

                return (query['has_photo'] === 'true' && item.hasOwnProperty('main_photo')) || (query['has_photo'] === 'false' && !item.hasOwnProperty('main_photo'))
            })
            .filter(function (item) {
                if (!query.hasOwnProperty('in_contact')) {
                    return true;
                }

                return (query['in_contact'] === 'true' && item.contacts_exchanged > 0) || (query['in_contact'] === 'false' && item.contacts_exchanged === 0)
            })
            .filter(function (item) {
                return query.hasOwnProperty('favourite') ? item.favourite.toString() === query.favourite : true;
            })
            .filter(function (item) {
                return item.age >= parseInt(query.age[0]) && item.age <= parseInt(query.age[1]);
            })
            .filter(function (item) {
                return item.height_in_cm >= parseInt(query.height[0]) && item.height_in_cm <= parseInt(query.height[1]);
            })
            .filter(function (item) {
                var score = item.compatibility_score * 100;
                return score >= parseInt(query.compatibility_score[0]) && score <= parseInt(query.compatibility_score[1]);
            })
            .filter(function (item) {
                if (!query.hasOwnProperty('distance_in_km')) {
                    return true;
                }

                var diff = distance.getDistanceFromLatLonInKm(item.city.lat, item.city.lon, myCity.lat, myCity.lon);
                var index = parseInt(query.distance_in_km);
                return (index === 0 && diff < 30) || (index === 1 && diff >= 30 && diff <= 300) || (index === 2 && diff > 300);
            })
        ;

    return res.status(200).json({matches: filteredData});
};