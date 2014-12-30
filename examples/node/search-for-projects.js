/**
 * Logs in, then search for projects with percentComplete > 0
 */

var ApiFactory = require('./../../').ApiFactory;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '5.0'
});

util.print('Logs in, then search for projects with percentComplete > 0\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Searching for projects with percentComplete > 0 ...');
		instance.search('proj', {percentComplete: 0, percentComplete_Mod: 'gt'}).then(
			function(data) {
				util.log('Search success. Received data:');
				console.log(util.inspect(data, {colors:true}));
			},
			function(error) {
				util.log('Search failure. Received data:');
				console.log(util.inspect(error, {colors:true}));
			}
		);
	},
	function(error) {
		util.log('Login failure. Received data:');
		console.log(util.inspect(error, {colors:true}));
	}
);
