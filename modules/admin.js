var rp = require('request-promise');
var postgrestUrl = process.env.POSTGREST_URL;

exports.getInitialVendors = function(){
	return rp({
        uri: postgrestUrl + '/Vendors?status=eq.initial',
        method: 'GET',
        json: true,
        resolveWithFullResponse: true
    });
};
exports.approveVendor = function(vendorId){
	var update = { status : "approved" };
	return exports.updateVendor(vendorId, update)
		.then(function(response){
			return exports.getVendorWithId(response.body[0].id);
		});
};
exports.trustVendor = function(vendorId){
	var update = { status : "trusted" };
	return exports.updateVendor(vendorId, update)
		.then(function(response){
			return exports.getVendorWithId(response.body[0].id);
		});
};

exports.declineVendor = function(vendorId){
	var update = { status : "declined" };
	return exports.updateVendor(vendorId, update)
		.then(function(response){
			return exports.getVendorWithId(response.body[0].id);
		});
};

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

