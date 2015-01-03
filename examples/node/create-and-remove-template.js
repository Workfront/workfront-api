/**
 * Logs in, then creates a new template with name "API Template", then removes it
 */

var ApiFactory = require('./../../').ApiFactory;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

util.print('Logs in, then creates a new template with name "API Template", then removes it\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Creating new template ...');
		instance.post('tmpl', {name: 'API Template', description: 'This template has been created using API'}).then(
			function(data) {
				util.log('Create success. Received data:');
				console.log(util.inspect(data, {colors:true}));
				util.log('Removing template with objID=' + data.ID + ' ...');
				instance.remove('tmpl', data.ID, true).then(
					function() {
						util.log('Remove success');
					},
					function(error) {
						util.log('Remove failure. Received data:');
						console.log(util.inspect(error, {colors:true}));
					}
				);
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
