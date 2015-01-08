/**
 * Logs in, then creates a group "Api Group", edits the name to read "Api Group 2", then deletes it
 */

var ApiFactory = require('./../../').ApiFactory;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

util.print('Logs in, then creates a group "Api Group", edits the name to read "Api Group 2", then deletes it\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Creating new group ...');
		instance.create('group', {name: 'Api Group'}).then(
			function(data) {
				util.log('Create success. Received data:');
				console.log(util.inspect(data, {colors:true}));
				instance.edit('group', data.ID, {
					name: 'Api Group 2'
				}, ['ID']).then(
					function(data) {
						util.log('Edit success. Received data:');
						console.log(util.inspect(data, {colors:true}));
						instance.remove('group', data.ID).then(
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
						util.log('Edit failure. Received data:');
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
