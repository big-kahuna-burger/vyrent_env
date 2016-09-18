var rp = require('request-promise');

var postgrestUrl = process.env.POSTGREST_URL;

exports.getVendorWithId = function(vendorId) {
    return rp({
        uri: postgrestUrl + '/Vendors?id=eq.' + vendorId,
        method: 'GET',
        json: true,
        resolveWithFullResponse: true,
        headers: {
            'Prefer': 'plurality=singular'
        }
    });
};

exports.createVendor = function(properties){
    return rp({
        uri: postgrestUrl + '/Vendors',
        method: 'POST',
        json: true,
        body: properties,
        resolveWithFullResponse: true,
        headers: {
            'Prefer': 'return=representation'
        }
    });
};

exports.createVendorForUser = function(userId, vendorProperties){
    return exports.createVendor(vendorProperties)
        .then(function(response){
            return exports.addVendorToUser(userId, response.body.id)
        })
        .then(function(response){
            return exports.getVendorWithId(response.body.vendor_id);
        });
};

exports.addVendorToUser = function(userId, vendorId) {
    return rp({
        uri: postgrestUrl + '/User_Vendor',
        method: 'POST',
        json: true,
        body: {
            user_id: userId,
            vendor_id: vendorId
        },
        resolveWithFullResponse: true,
        headers: {
            'Prefer': 'return=representation'
        }
    });
};

exports.removeVendorFromUser = function(userId, vendorId) {
    return rp({
        uri: postgrestUrl + '/User_Vendor?user_id=eq.' + userId + '&vendor_id=eq.' + vendorId,
        method: 'DELETE',
        json: true,
        resolveWithFullResponse: true,
        headers: {
            'Prefer': 'return=representation'
        }
    });
};

exports.removeVendorFromAllUsers = function(vendorId) {
    return rp({
        uri: postgrestUrl + '/User_Vendor?vendor_id=eq.' + vendorId,
        method: 'DELETE',
        json: true,
        resolveWithFullResponse: true,
        headers: {
            'Prefer': 'return=representation'
        }
    });
};

exports.deleteVendor = function(vendorId) {
    return rp({
        uri: postgrestUrl + '/Vendors?id=eq.' + vendorId,
        method: 'DELETE',
        json: true,
        resolveWithFullResponse: true,
        headers: {
            'Prefer': 'return=representation'
        }
    });
};

exports.deleteForceVendor = function(vendorId) {
    return exports.removeVendorFromAllUsers(vendorId)
        .then(function(response){
            return exports.deleteVendor(vendorId);
        });
};

exports.updateVendor = function(vendorId, vendorProperties){
    return rp({
        uri: postgrestUrl + '/Vendors?id=eq.' + vendorId,
        method: 'PATCH',
        json: true,
        body: vendorProperties,
        resolveWithFullResponse: true,
        headers: {
            'Prefer': 'return=representation'
        }
    });
};