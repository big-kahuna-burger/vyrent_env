var rp = require('request-promise');

var postgrestUrl = process.env.POSTGREST_URL;

exports.getUserWithExternalId = function (externalId) {
    return rp({
        uri: postgrestUrl + '/Users?external_id=eq.' + externalId,
        method: 'GET',
        json: true,
        resolveWithFullResponse: true,
        headers:{
            'Prefer': 'plurality=singular'
        }
    });
};

exports.createUserWithExternalId = function(externalId){
    return rp({
            uri: postgrestUrl + '/Users',
            method: 'POST',
            json: true,
            body: {
                external_id: externalId
            },
            resolveWithFullResponse: true,
            headers: {
                'Prefer': 'return=representation'
            }
        });
};

exports.deleteUserWithExternalId = function(externalId){
    return rp({
            uri: postgrestUrl + '/Users?external_id=eq.' + externalId,
            method: 'DELETE',
            json: true,
            resolveWithFullResponse: true,
            headers: {
                'Prefer': 'return=representation'
            }
        })
};