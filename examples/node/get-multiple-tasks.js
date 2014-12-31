/**
 * Logs in, queries details of multiple tasks
 */

var ApiFactory = require('./../../').ApiFactory;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

util.print('Logs in, queries details of multiple tasks\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Getting details of multiple tasks using thier ids ...');
		instance.get('task', ['5477374400000eb8b107b4fb2a305af5', '547817290000114ddd04910ee9cae040'], ['*']).then(
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
