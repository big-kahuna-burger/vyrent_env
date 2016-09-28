require('dotenv').config({ path: 'deploy.env' });
var jwt = require('jsonwebtoken');
var rp = require('request-promise');
var expect = require('chai').expect;

var User = require('../modules/user');
var Vendor = require('../modules/vendor');
var Watch = require('../modules/watch');
var Application = require('../modules/application');

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

var dummyApplication;

describe('Application Module', function () {
    before(function (done) {
        User.createUserWithExternalId(dummyUserProfile.user_id)
            .then(function (response) {
                dummyUser = response.body;
                return Vendor.createVendorForUser(dummyUser.id, dummyVendorProperties);
            })
            .then(function (response) {
                dummyVendor = response.body;
                return Watch.createWatchForVendor(dummyVendor.id, dummyWatchProperties);
            })
            .then(function (response) {
                dummyWatch = response.body;
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    it('should starts an application for a user', function (done) {
        Application.createApplicationForUser(dummyUser.id, {})
            .then(function (response) {
                dummyApplication = response.body;
                expect(dummyApplication.status).to.be.equal('draft');
                done();
            })
            .catch(function (err) {
                done(err);
            });

    });
    it('should add watch to that application', function (done) {
        Application.addWatch(dummyApplication.id, dummyWatch.id)
            .then(function (response) {
                var application_watches = response.body;
                expect(application_watches.status).to.be.equal('pending');
                expect(application_watches.source).to.be.equal('user');
                expect(application_watches.watch_id).to.be.equal(dummyWatch.id);
                expect(application_watches.application_id).to.be.equal(dummyApplication.id);
                done();
            })
            .catch(function (err) {
                done(err);
            });

    });
    it('should add another watch to that application', function (done) {
        Application.addWatch(dummyApplication.id, dummyWatch2.id)
            .then(function (response) {
                var application_watches = response.body;
                expect(application_watches.status).to.be.equal('pending');
                expect(application_watches.source).to.be.equal('user');
                expect(application_watches.watch_id).to.be.equal(dummyWatch2.id);
                expect(application_watches.application_id).to.be.equal(dummyApplication.id);
                done();
            })
            .catch(function (err) {
                done(err);
            });

    });
    it('should remove watch from application', function (done) {
        Application.removeWatch(dummyApplication.id, dummyWatch2.id)
            .then(function (response) {
                done();
            })
            .catch(function (err) {
                done(err);
            });

    });
    it('should submit an application', function (done) {
        Application.submitApplication(dummyApplication.id)
            .then(function (response) {
                var dummyApplication = response.body;
                expect(dummyApplication.status).to.be.equal('pending');
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
    after(function (done) {
        Watch.deleteWatch(dummyWatch.id)
            .then(Vendor.deleteForceVendor(dummyVendor.id))
            .then(User.deleteUserWithExternalId(dummyUserProfile.user_id))
            .then(function (response) {
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });
});