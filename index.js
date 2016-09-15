var auth = require('./modules/auth');
var util = require('./modules/util');

exports.handler = function(event, context, callback) {
    var token = util.getTokenOfEvent(event);
    auth.getUserOfToken(token)
        .then(function(user){
            callback(null, user);
        })
        .catch(function(err){
            callback(err, null);
        });
}