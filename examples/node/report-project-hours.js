/**
 * Logs in, then returns list of hours grouped by project names
 */

var ApiFactory = require('./../../').ApiFactory;
var ApiConstants = require('./../../').ApiConstants;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

util.print('Logs in, then returns list of hours grouped by project names\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Running report ...');
		var query = {};
		query['project:name_1' + ApiConstants.GROUPBY] = true;
		query['hours' + ApiConstants.AGGFUNC] = ApiConstants.Functions.SUM;
		instance.report('hour', query).then(
			function(data) {
				util.log('Report success. Received data:');
				console.log(util.inspect(data, {colors:true}));
			},
			function(error) {
				util.log('Report failure. Received data:');
				console.log(util.inspect(error, {colors:true}));
			}
		);
	},
	function(error) {
		util.log('Login failure. Received data:');
		console.log(util.inspect(error, {colors:true}));
	}
);
