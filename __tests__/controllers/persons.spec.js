'use strict';

var request = require('supertest');
var should = require('should');
var matches = require('../../api/models/matches');

describe('Controller: Persons', function () {

    var url = 'http://localhost:8080/api/v1/';

    it('should get status 404 to any routes not matching API endpoints', function (done) {
        request(url)
            .get('persons')
            .end(function (err, res) {
                res.status.should.be.equal(404);
                should(res.body).have.property('message');
                should(res.body.message).be.exactly('No endpoint exists at /api/v1/persons');
                done();
            });
    });

    it('should get 25 filtered persons by default no query', function (done) {
        request(url)
            .get('person')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(25);
                done();
            });
    });

    it('should get filtered persons by query "has_photo=true"', function (done) {
        var count = matches.matches.reduce(function (i, item) {
            return item.hasOwnProperty('main_photo') ? ++i : i;
        }, 0);

        request(url)
            .get('person?has_photo=true')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(count);
                done();
            });
    });

    it('should get filtered persons by query "has_photo=false"', function (done) {
        var count = matches.matches.reduce(function (i, item) {
            return !item.hasOwnProperty('main_photo') ? ++i : i;
        }, 0);

        request(url)
            .get('person?has_photo=false')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(count);
                done();
            });
    });

    it('should get status 400 as invalid "has_photo=yes"', function (done) {
        request(url)
            .get('person?has_photo=yes')
            .end(function (err, res) {
                res.status.should.be.equal(400);
                should(res.body).have.property('messages');
                should(res.body.messages).be.a.Array().and.have.lengthOf(1);
                done();
            });
    });

    it('should get filtered persons by query "in_contact=true"', function (done) {
        var count = matches.matches.reduce(function (i, item) {
            return item.contacts_exchanged > 0 ? ++i : i;
        }, 0);

        request(url)
            .get('person?in_contact=true')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(count);
                done();
            });
    });

    it('should get filtered persons by query "in_contact=false"', function (done) {
        var count = matches.matches.reduce(function (i, item) {
            return item.contacts_exchanged === 0 ? ++i : i;
        }, 0);

        request(url)
            .get('person?in_contact=false')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(count);
                done();
            });
    });

    it('should get status 400 as invalid "in_contact=no"', function (done) {
        request(url)
            .get('person?in_contact=no')
            .end(function (err, res) {
                res.status.should.be.equal(400);
                should(res.body).have.property('messages');
                should(res.body.messages).be.a.Array().and.have.lengthOf(1);
                done();
            });
    });

    it('should get filtered persons by query "favourite=true"', function (done) {
        var count = matches.matches.reduce(function (i, item) {
            return item.favourite ? ++i : i;
        }, 0);

        request(url)
            .get('person?favourite=true')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(count);
                done();
            });
    });

    it('should get status 400 as invalid "favourite=foobar"', function (done) {
        request(url)
            .get('person?favourite=foobar')
            .end(function (err, res) {
                res.status.should.be.equal(400);
                should(res.body).have.property('messages');
                should(res.body.messages).be.a.Array().and.have.lengthOf(1);
                done();
            });
    });

    it('should get filtered person by query "age=29&age=31"', function (done) {
        var count = matches.matches.reduce(function (i, item) {
            return item.age >= 29 && item.age <= 31 ? ++i : i;
        }, 0);

        request(url)
            .get('person?age=29&age=31')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(count);
                done();
            });
    });

    it('should get status 400 as Invalid age data types "age=TwentyFive"', function (done) {
        request(url)
            .get('person?age=TwentyFive')
            .end(function (err, res) {
                res.status.should.be.equal(400);
                should(res.body).have.property('messages');
                should(res.body.messages).be.a.Array().and.have.lengthOf(1);
                should(res.body.messages[0]).be.exactly('Invalid age data types');
                done();
            });
    });

    it('should get status 400 as Invalid age range "age=100&age=10"', function (done) {
        request(url)
            .get('person?age=100&age=10')
            .end(function (err, res) {
                res.status.should.be.equal(400);
                should(res.body).have.property('messages');
                should(res.body.messages).be.a.Array().and.have.lengthOf(1);
                should(res.body.messages[0]).be.exactly('Invalid age range');
                done();
            });
    });

    it('should get filtered persons by query "height=140&height=160"', function (done) {
        var count = matches.matches.reduce(function (i, item) {
            return item.height_in_cm >= 140 && item.height_in_cm <= 160 ? ++i : i;
        }, 0);

        request(url)
            .get('person?height=140&height=160')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(count);
                done();
            });
    });

    it('should get status 400 as Invalid height data types "height=6feet5inches"', function (done) {
        request(url)
            .get('person?height=6feet5inches')
            .end(function (err, res) {
                res.status.should.be.equal(400);
                should(res.body).have.property('messages');
                should(res.body.messages).be.a.Array().and.have.lengthOf(1);
                should(res.body.messages[0]).be.exactly('Invalid height data types');
                done();
            });
    });

    it('should get status 400 as Invalid height range "height=100&height=300"', function (done) {
        request(url)
            .get('person?height=100&height=300')
            .end(function (err, res) {
                res.status.should.be.equal(400);
                should(res.body).have.property('messages');
                should(res.body.messages).be.a.Array().and.have.lengthOf(1);
                should(res.body.messages[0]).be.exactly('Invalid height range');
                done();
            });
    });

    it('should get filtered persons by query "compatibility_score=80&compatibility_score=99"', function (done) {
        var count = matches.matches.reduce(function (i, item) {
            return item.compatibility_score >= 0.8 && item.compatibility_score <= 0.99 ? ++i : i;
        }, 0);

        request(url)
            .get('person?compatibility_score=80&compatibility_score=99')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(count);
                done();
            });
    });

    it('should get status 400 as Invalid compatibility_score data types "compatibility_score=50%"', function (done) {
        request(url)
            .get('person?compatibility_score=50%')
            .end(function (err, res) {
                res.status.should.be.equal(400);
                should(res.body).have.property('messages');
                should(res.body.messages).be.a.Array().and.have.lengthOf(1);
                should(res.body.messages[0]).be.exactly('Invalid compatibility_score data types');
                done();
            });
    });

    it('should get status 400 as Invalid compatibility_score range "compatibility_score=100&compatibility_score=0"', function (done) {
        request(url)
            .get('person?compatibility_score=100&compatibility_score=0')
            .end(function (err, res) {
                res.status.should.be.equal(400);
                should(res.body).have.property('messages');
                should(res.body.messages).be.a.Array().and.have.lengthOf(1);
                should(res.body.messages[0]).be.exactly('Invalid compatibility_score range');
                done();
            });
    });

    it('should get 1 filtered person by query "distance_index=0"', function (done) {
        request(url)
            .get('person?distance_index=0')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(1);
                done();
            });
    });

    it('should get 19 filtered persons by query "distance_index=1"', function (done) {
        request(url)
            .get('person?distance_index=1')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(19);
                done();
            });
    });

    it('should get 5 filtered persons by query "distance_index=2"', function (done) {
        request(url)
            .get('person?distance_index=2')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(5);
                done();
            });
    });

    it('should get status 400 as Invalid distance_index as "distance_index=3"', function (done) {
        request(url)
            .get('person?distance_index=3')
            .end(function (err, res) {
                res.status.should.be.equal(400);
                should(res.body).have.property('messages');
                should(res.body.messages).be.a.Array().and.have.lengthOf(1);
                should(res.body.messages[0]).be.exactly('Invalid distance_index');
                done();
            });
    });

    it('should get 1 filtered person, whose display_name is "Clare"', function (done) {
        request(url)
            .get('person?age=40&age=60&compatibility_score=80&compatibility_score=99&distance_index=1&favourite=false&has_photo=true&height=135&height=151&in_contact=true')
            .end(function (err, res) {
                res.status.should.be.equal(200);
                should(res.body).have.property('matches');
                should(res.body.matches).be.a.Array().and.have.lengthOf(1);
                should(res.body.matches[0].display_name).be.exactly('Clare');
                done();
            });
    });

});