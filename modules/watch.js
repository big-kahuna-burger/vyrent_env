var rp = require('request-promise');

var postgrestUrl = process.env.POSTGREST_URL;

exports.getWatchWithId = function (watchId) {
    return rp({
        uri: postgrestUrl + '/Watches?id=eq.' + watchId,
        method: 'GET',
        json: true,
        resolveWithFullResponse: true,
        headers: {
            'Prefer': 'plurality=singular'
        }
    });
}

exports.createWatchForVendor = function (vendorId, watchProperties) {
    watchProperties.vendor_id = vendorId;
    return rp({
        uri: postgrestUrl + '/Watches',
        method: 'POST',
        json: true,
        body: watchProperties,
        resolveWithFullResponse: true,
        headers: {
            'Prefer': 'return=representation'
        }
    });
};

exports.deleteWatch = function (watchId) {
    return rp({
        uri: postgrestUrl + '/Watches?id=eq.' + watchId,
        method: 'DELETE',
        json: true,
        resolveWithFullResponse: true,
        headers: {
            'Prefer': 'return=representation'
        }
    });
};