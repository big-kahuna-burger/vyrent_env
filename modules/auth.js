var promise = require("bluebird");
var jwt = require('jsonwebtoken');
var AuthenticationClient = require("auth0").AuthenticationClient;

var User = require("./user");

var auth0 = new AuthenticationClient({
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID
});
var signiture = new Buffer(process.env.AUTH0_SECRET, 'base64');

exports.getUserOfToken = function (token) {
    return new Promise(function (resolve, reject) {
        var result = {};
        exports.getUserProfile(token)
            .then(function (profile) {
                result.profile = profile;
                return User.getUserWithExternalId(profile.user_id);
            })
            .then(function (user) {
                result.user = user.body;
                resolve(result);
            })
            .catch(function (err) {
                reject(err);
            })
    });
}

exports.getUserProfile = function (token) {
    return new promise(function (resolve, reject) {
        try {
            var payload = jwt.verify(token, signiture);
            if (payload.iss && payload.iss.indexOf(process.env.AUTH0_DOMAIN) > -1) {
                auth0.tokens.getInfo(token)
                    .then(function(profile){
                        resolve(profile);
                    }).catch(function(err){
                        reject(err);
                    });
            }
            else{
                resolve(payload);
            }
        } catch (err) {
            reject(err);
        }
    });
}