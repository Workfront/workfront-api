/**
 * Logs in, then creates a new project with name "API Project", then copies it
 */

var ApiFactory = require('./../../').ApiFactory;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

util.print('Logs in, then creates a new project with name "API Project", then copies it\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Creating new project ...');
		instance.create('proj', {name: 'API Project', description: 'This project has been created using API'}).then(
			function(data) {
				util.log('Create success. Received data:');
				console.log(util.inspect(data, {colors:true}));
				instance.copy('proj', data.ID, {name: 'API Project Copy'}).then(
					function(data) {
						util.log('Copy success. Received data:');
						console.log(util.inspect(data, {colors:true}));
					},
					function(error) {
						util.log('Copy failure. Received data:');
						console.log(util.inspect(error, {colors:true}));
					}
				)
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
