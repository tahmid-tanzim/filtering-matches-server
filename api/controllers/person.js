'use strict';

var when = require('when');
var matches = require('../models/matches');

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
exports.get = function(req, res) {
  console.log('query: ', JSON.stringify(req.query, null, 2));
  return res.status(200).json(matches);
};