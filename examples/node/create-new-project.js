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
		util.log('Creating new project ...');
		instance.post('proj', {name: 'API Project', description: 'This project has been created using API'}).then(
			function(data) {
				util.log('Create success. Received data:');
				console.log(util.inspect(data, {colors:true}));
			},
			function(error) {
				util.log('Create failure. Received data:');
				console.log(util.inspect(error, {colors:true}));
			}
		);
	},
	function(error) {
		util.log('Login failure. Received data:');
		console.log(util.inspect(error, {colors:true}));
	}
);
