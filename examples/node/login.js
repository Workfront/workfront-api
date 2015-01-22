/**
 * Logs in
 */

var ApiFactory = require('./../../').ApiFactory;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'https://hub.attask.com',
	version: '4.0'
});

util.print('Logs in\n');
util.log('Logging in ...');
//instance.login('new@user.attask', 'user').then(
instance.login('sassounderderian', 'inMeLet14').then(
	function(data) {
		util.log('Login success. Received data:');
		console.log(util.inspect(data, {colors:true}));
	},
	function(error) {
		util.log('Login failure. Received data:');
		console.log(util.inspect(error, {colors:true}));
	}
);
