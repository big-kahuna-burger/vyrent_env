require('dotenv').config({ path: 'deploy.env' });
var jwt = require('jsonwebtoken');
var rp = require('request-promise');
var expect = require('chai').expect;

var Auth = require('../modules/auth');
var User = require('../modules/user');
var Vendor = require('../modules/vendor');
var Admin = require('../modules/admin');

var dummyAdminProfile = {
    user_id: 'auth0|123admin',
    role: 'admin'
}

var dummyUser1Profile = {
    user_id: 'auth0|123user1'
}
var dummyUser1;
var dummyVendor1Properties = {
    name: 'vendor1',
    company_legal_name: 'cln1',
    dba: 'dba1'
}
var dummyVendor1;

var dummyUser2Profile = {
    user_id: 'auth0|123user2'
}
var dummyUser2;
var dummyVendor2Properties = {
    name: 'vendor2',
    company_legal_name: 'cln2',
    dba: 'dba2'
}
var dummyVendor2;

var dummyAdminToken = jwt.sign(dummyAdminProfile, new Buffer(process.env.AUTH0_SECRET, 'base64'));

describe('Admin Module', function(){
    before(function(done){
        User.createUserWithExternalId(dummyAdminProfile.user_id)
            .then(User.createUserWithExternalId(dummyUser1Profile.user_id))
            .then(function(response){
                dummyUser1 = response.body;
                return User.createUserWithExternalId(dummyUser2Profile.user_id);
            })
            .then(function(response){
                dummyUser2 = response.body;
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    describe('Vendor', function(){
        before(function(done){
            Vendor.createVendorForUser(dummyUser1.id, dummyVendor1Properties)
                .then(function(response){
                    dummyVendor1 = response.body;
                    return Vendor.createVendorForUser(dummyUser2.id, dummyVendor2Properties);
                })
                .then(function(response){
                    dummyVendor2 = response.body;
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('should return two vendors with initial status', function(done){
            Admin.getInitialVendors()
                .then(function(response){
                    expect(response.body.length).to.be.equal(2);
                    response.body.forEach(function(vendor){
                        expect(vendor.status).to.be.equal('initial');
                    });
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('should approve a vendor', function(done){
            Admin.approveVendor(dummyVendor1.id)
                .then(function(response){
                    dummyVendor1 = response.body;
                    expect(dummyVendor1.status).to.be.equal('approved');
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('should return one vendor with initial status', function(done){
            Admin.getInitialVendors()
                .then(function(response){
                    expect(response.body.length).to.be.equal(1);
                    response.body.forEach(function(vendor){
                        expect(vendor.status).to.be.equal('initial');
                    });
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('should decline a vendor', function(done){
            Admin.declineVendor(dummyVendor2.id)
                .then(function(response){
                    dummyVendor2 = response.body;
                    expect(dummyVendor2.status).to.be.equal('declined');
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('should return no vendor with initial status', function(done){
            Admin.getInitialVendors()
                .then(function(response){
                    expect(response.body.length).to.be.equal(0);
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        it('should trust a vendor', function(done){
            Admin.trustVendor(dummyVendor1.id)
                .then(function(response){
                    dummyVendor1 = response.body;
                    expect(dummyVendor1.status).to.be.equal('trusted');
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
        after(function(done){
            Vendor.deleteForceVendor(dummyVendor1.id)
                .then(Vendor.deleteForceVendor(dummyVendor2.id))
                .then(function (response) {
                    done();
                })
                .catch(function (err) {
                    done(err);
                });
        });
    });
    after(function (done) {
        User.deleteUserWithExternalId(dummyAdminProfile.user_id)
            .then(User.deleteUserWithExternalId(dummyUser1Profile.user_id))
            .then(User.deleteUserWithExternalId(dummyUser2Profile.user_id))
            .then(function (response) {
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
})