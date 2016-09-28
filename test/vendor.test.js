require('dotenv').config({ path: 'deploy.env' });
var jwt = require('jsonwebtoken');
var rp = require('request-promise');
var expect = require('chai').expect;

var User = require('../modules/user');
var Vendor = require('../modules/vendor');

var dummyUserProfile = {
    user_id: 'auth0|123user'
};
var dummyUser;

var dummyVendorProperties = {
    name: 'vendor1',
    company_legal_name: 'cln1',
    dba: 'dba1'
}
var dummyVendor;

var dummyUserToken = jwt.sign(dummyUserProfile, new Buffer(process.env.AUTH0_SECRET, 'base64'));

describe('Vendor Module', function () {
    before(function (done) {
        User.createUserWithExternalId(dummyUserProfile.user_id)
            .then(function (response) {
                dummyUser = response.body;
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    it('should create a vendor for user', function (done) {
        Vendor.createVendorForUser(dummyUser.id, dummyVendorProperties)
            .then(function (response) {
                dummyVendor = response.body;
                expect(dummyVendor.status).to.be.equal('initial');
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    it('should update vendor status', function (done) {
        var update = {
            status: 'approved'
        };
        Vendor.updateVendor(dummyVendor.id, update)
            .then(function (response) {
                dummyVendor = response.body[0];
                expect(dummyVendor.status).to.be.equal(update.status);
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    after(function (done) {
        Vendor.deleteForceVendor(dummyVendor.id)
            .then(User.deleteUserWithExternalId(dummyUserProfile.user_id))
            .then(function (response) {
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
});