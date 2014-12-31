/**
 * Logs in, returns number of active users
 */

var ApiFactory = require('./../../').ApiFactory;
var ApiConstants = require('./../../').ApiConstants;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

util.print('Logs in, returns number of active users\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function() {
		util.log('Getting number of active users ...');
		var query = {};
		query['isActive'] = true;
		query['isActive' + ApiConstants.MOD] = ApiConstants.Operators.EQUAL;
		instance.count('user', query).then(
			function(data) {
				util.log('Get success. Received data:');
				console.log(util.inspect(data, {colors:true}));
			},
			function(error) {
				util.log('Get failure. Received data:');
				console.log(util.inspect(error, {colors:true}));
			}
		);
	},
	function(error) {
		util.log('Login failure. Received data:');
		console.log(util.inspect(error, {colors:true}));
	}
);
