'use strict';

var should = require('should');
var distance = require('../../api/utils/distance');

describe('Utils: Distance', function () {

    it('should get distance in km', function (done) {
        var diff = distance.getDistanceFromLatLonInKm(54.607868, -5.926437, 55.006763, -7.318268);
        should(diff).be.a.Number().and.exactly(99.61255094849759);
        done();
    });

});