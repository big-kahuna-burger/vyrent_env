var rp = require('request-promise');

var postgrestUrl = process.env.POSTGREST_URL;

exports.createApplicationForUser = function (userId, app) {
    return rp({
            uri: postgrestUrl + '/Applications',
            method: 'POST',
            json: true,
            body: {
                "user_id" : userId
            },
            resolveWithFullResponse: true,
            headers: {
                'Prefer': 'return=representation'
            }
        });
};
exports.addWatch = function (applicationId, watchId) {
    return rp({
        uri: postgrestUrl + '/Application_Watches',
            method: 'POST',
            json: true,
            body: {
                "application_id" : applicationId,
                "watch_id" : watchId
            },
            resolveWithFullResponse: true,
            headers: {
                'Prefer': 'return=representation'
            }
    });
};

exports.removeWatch = function (applicationId, watchId) {
    return rp({
        uri: postgrestUrl + '/Application_Watches',
            method: 'DELETE',
            json: true,
            body: {
                "application_id" : applicationId,
                "watch_id" : watchId
            },
            resolveWithFullResponse: true,
            headers: {
                'Prefer': 'return=representation'
            }
    });
};

exports.submitApplication = function (applicationId) {
    return rp({
        uri: postgrestUrl + '/Applications?id=eq.' + applicationId,
            method: 'PATCH',
            json: true,
            body: {
                "status" : "pending"
            },
            resolveWithFullResponse: true,
            headers: {
                'Prefer': 'return=representation'
            }
    });
};