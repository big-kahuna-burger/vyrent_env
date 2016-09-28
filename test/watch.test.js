require('dotenv').config({ path: 'deploy.env' });
var jwt = require('jsonwebtoken');
var rp = require('request-promise');
var expect = require('chai').expect;

var User = require('../modules/user');
var Vendor = require('../modules/vendor');
var Watch = require('../modules/watch');

var dummyUserProfile = {
    user_id: 'auth0|123user1'
}
var dummyUser;
var dummyVendorProperties = {
    name: 'vendor1',
    company_legal_name: 'cln1',
    dba: 'dba1'
}
var dummyVendor;

var dummyWatchProperties = {
    "model": "Yacht Master",
    "version": "",
    "reference_number": "16623",
    "gender": "Men's",
    "retail_price": "",
    "cost_price": "$ 8,000.00",
    "description": "The Rolex Yacht Master is redesign of the Submariner, and is known as Rolex's Nautical watch. 40mm stainless steel case, 18K yellow gold rotatable time lapse bezel, blue dial, and stainless steel and 18K yellow gold Oysterlock bracelet.",
    "movement": "Automatic",
    "case_diameter": "40MM",
    "case_material": "Stainless Steel",
    "bezel": "18K Yellow Gold",
    "band": "Oyster",
    "band_material": "Stainless Steel and Yellow Gold",
    "clasp": "Folding",
    "accessories": "None",
    "vyrent_sku": "",
    "year": "2012-2015",
    "brand": "Rolex",
    "pictures": [
        {
            "url": "https://s3.amazonaws.com/vyrent-dev/watches/1_1.png"
        },
        {
            "url": "https://s3.amazonaws.com/vyrent-dev/watches/1_2.png"
        },
        {
            "url": "https://s3.amazonaws.com/vyrent-dev/watches/1_3.png"
        }
    ],
    "vendor_id": "0bc4c578-814d-48a9-ba23-401f40864225",
    "featured": false
};
var dummyWatch;

describe('Watch Module', function () {
    before(function (done) {
        User.createUserWithExternalId(dummyUserProfile.user_id)
            .then(function (response) {
                dummyUser = response.body;
                return Vendor.createVendorForUser(dummyUser.id, dummyVendorProperties);
            })
            .then(function (response) {
                dummyVendor = response.body;
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    it('should add a watch for vendor', function (done) {
        Watch.createWatchForVendor(dummyVendor.id, dummyWatchProperties)
            .then(function (response) {
                dummyWatch = response.body;
                expect(dummyWatch.id).to.not.be.equal(undefined);
                expect(dummyWatch.model).to.be.equal(dummyWatchProperties.model);
                expect(dummyWatch.vendor_id).to.be.equal(dummyVendor.id);
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    it('should get created watch', function(done){
        Watch.getWatchWithId(dummyWatch.id)
            .then(function(response){
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    it('should delete a watch from list', function (done) {
        Watch.deleteWatch(dummyWatch.id)
            .then(function (response) {
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    it('should not get deleted watch', function(done){
        Watch.getWatchWithId(dummyWatch.id)
            .then(function(response){
                done(response.body);
            })
            .catch(function (err) {
                expect(err.statusCode).to.be.equal(404);
                done();
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