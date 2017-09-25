'use strict';

var matches = require('../models/matches');
var distance = require('../utils/distance');

var myCity = {
    lat: 52.412811,
    lon: -1.778197
};
/* ====================================================== */

/**
 * @api {get} /person Get Person
 * @apiName Get
 * @apiGroup Person
 *
 * @apiQuery {Number} id Person's id
 *
 * @apiSuccess {Number} status HTTP status code (200)
 * @apiSuccess {Object} matches retrieved Persons array
 */
exports.get = function (req, res) {
    var query = req.query;

    var filteredData = matches.matches
        .filter(function (item) {
            if (!query.hasOwnProperty('has_photo')) {
                return true;
            }

            return (query['has_photo'] && item.hasOwnProperty('main_photo')) || (!query['has_photo'] && !item.hasOwnProperty('main_photo'))
        })
        .filter(function (item) {
            if (!query.hasOwnProperty('in_contact')) {
                return true;
            }

            return (query['in_contact'] && item.contacts_exchanged > 0) || (!query['in_contact'] && item.contacts_exchanged === 0)
        })
        .filter(function (item) {
            return query.hasOwnProperty('favourite') ? item.favourite === query.favourite : true;
        })
        .filter(function (item) {
            if (!query.hasOwnProperty('age')) {
                return true;
            }

            return item.age >= query.age[0] && item.age <= query.age[1];
        })
        .filter(function (item) {
            if (!query.hasOwnProperty('height')) {
                return true;
            }

            return item.height_in_cm >= query.height[0] && item.height_in_cm <= query.height[1];
        })
        .filter(function (item) {
            if (!query.hasOwnProperty('compatibility_score')) {
                return true;
            }

            var score = item.compatibility_score * 100;
            return score >= query.compatibility_score[0] && score <= query.compatibility_score[1];
        })
        .reduce(function (accumulator, item) {
            item.city['distance_in_km'] = distance.getDistanceFromLatLonInKm(item.city.lat, item.city.lon, myCity.lat, myCity.lon);

            if (!query.hasOwnProperty('distance_index')) {
                return accumulator.concat([item]);
            }

            var index = query.distance_index;
            if ((index === 0 && item.city['distance_in_km'] < 30.0) || (index === 1 && item.city['distance_in_km'] >= 30.0 && item.city['distance_in_km'] <= 300.0) || (index === 2 && item.city['distance_in_km'] > 300.0)) {
                return accumulator.concat([item]);
            } else {
                return accumulator;
            }
        }, []);

    return res.status(200).json({matches: filteredData});
};