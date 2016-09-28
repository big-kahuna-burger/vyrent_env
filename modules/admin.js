var rp = require('request-promise');
var postgrestUrl = process.env.POSTGREST_URL;
var Vendor = require('./vendor');

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
	return Vendor.updateVendor(vendorId, update);
};
exports.trustVendor = function(vendorId){
	var update = { status : "trusted" };
	return Vendor.updateVendor(vendorId, update);
};

exports.declineVendor = function(vendorId){
	var update = { status : "declined" };
	return Vendor.updateVendor(vendorId, update);
};

