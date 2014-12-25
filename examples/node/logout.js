global.Promise = require('promise');

var ApiFactory = require('./../../').ApiFactory;
var util = require('util');

var instance = ApiFactory.getInstance({
	hostname: 'localhost',
	version: '5.0',
	port: 8080
});

util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Logging out ...');
		instance.logout().then(
			function(data) {
				util.log('Logout success. Received data:');
				console.log(util.inspect(data, {colors:true}));
			},
			function(error) {
				util.log('Logout failure. Received data:');
				console.log(util.inspect(error, {colors:true}));
			}
		);
	},
	function(error) {
		util.log('Login failure. Received data:');
		console.log(util.inspect(error, {colors:true}));
	}
);
