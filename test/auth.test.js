require('dotenv').config({ path: 'deploy.env' });
var jwt = require('jsonwebtoken');
var rp = require('request-promise');
var expect = require('chai').expect;

var Auth = require('../modules/auth');
var User = require('../modules/user');

var dummyAdminProfile = {
    user_id: 'auth0|123',
    role: 'admin'
}
var dummyNotAvailableProfile = {
    user_id: 'auth0|1234',
    role: 'admin'
}
var fakeProfile = {
    user_id: 'auth0|123',
    role: 'admin'
}
var dummyAdminToken = jwt.sign(dummyAdminProfile, new Buffer(process.env.AUTH0_SECRET, 'base64'));
var dummyNotAvailableToken = jwt.sign(dummyNotAvailableProfile, new Buffer(process.env.AUTH0_SECRET, 'base64'));
var fakeToken = jwt.sign(dummyAdminProfile, new Buffer('fakeSecret', 'base64'));

describe('Auth Module', function () {
    before(function (done) {
        User.createUserWithExternalId(dummyAdminProfile.user_id)
            .then(function (response) {
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    it('should get an existing user from a valid token', function (done) {
        Auth.getUserOfToken(dummyAdminToken)
            .then(function (user) {
                expect(user.profile.user_id).to.be.equal(dummyAdminProfile.user_id);
                expect(user.profile.role).to.be.equal(dummyAdminProfile.role);
                expect(user.user.external_id).to.be.equal(dummyAdminProfile.user_id);
                done();
            }).catch(function (err) {
                done(err);
            })
    });
    it('should isAdmin return true for admin User', function(done){
        expect(Auth.isAdmin(dummyAdminProfile)).to.be.equal(true);
        done();
    });
    it('should not get user from a fake token', function (done) {
        Auth.getUserOfToken(fakeToken)
            .then(function (user) {
                done(user);
            }).catch(function (err) {
                expect(err.message).to.be.equal('invalid signature');
                done();
            })
    });
    it('should not get non-existing user from a valid token', function (done) {
        Auth.getUserOfToken(dummyNotAvailableToken)
            .then(function (user) {
                done(user);
            }).catch(function (err) {
                expect(err.statusCode).to.be.equal(404);
                done();
            });
    });
    after(function (done) {
        User.deleteUserWithExternalId(dummyAdminProfile.user_id)
            .then(function (response) {
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
});