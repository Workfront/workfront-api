/**
 * Logs in, loads list of active users, then calls assignUserToken action for the first user
 */

var ApiFactory = require('./../../').ApiFactory;
var ApiConstants = require('./../../').ApiConstants;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

util.print('Logs in, loads list of active users, then calls assignUserToken action for the first user\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Loading list of active users ...');
		var query = {};
		query['isActive'] = true;
		query[ApiConstants.LIMIT] = 1;
		instance.search('user', query).then(
			function(data) {
				util.log('Load success. Received data:');
				console.log(util.inspect(data, {colors:true}));
				util.log('Calling action for user with objID=' + data[0].ID + ' ...');
				instance.execute('user', data[0].ID, 'assignUserToken').then(
					function(data) {
						util.log('Action success. Received data:');
						console.log(util.inspect(data, {colors:true}));
					},
					function(error) {
						util.log('Action failure. Received data:');
						console.log(util.inspect(error, {colors:true}));
					}
				);
			},
			function(error) {
				util.log('Load failure. Received data:');
				console.log(util.inspect(error, {colors:true}));
			}
		);
	},
	function(error) {
		util.log('Login failure. Received data:');
		console.log(util.inspect(error, {colors:true}));
	}
);
