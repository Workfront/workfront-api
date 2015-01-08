/**
 * Logs in, then deletes all projects with name containing "API Project"
 */

var Api = require('./../../').Api;
var ApiConstants = require('./../../').ApiConstants;
var util = require('util');

var instance = new Api({
	url: 'http://localhost:8080',
	version: '4.0'
});

function deleteProject(projectID) {
	instance.remove('proj', projectID).then(
		function() {
			util.log('Removed '+projectID);
		},
		function(error) {
			util.log('Remove failure. Received data:');
			console.log(util.inspect(error, {colors:true}));
		}
	);
}

util.print('Logs in, then deletes all projects with name containing "API Project"\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Searching for projects with name containing "API Project" ...');
		var query = {};
		query['name'] = 'API Project';
		query['name' + ApiConstants.MOD] = ApiConstants.Operators.CONTAINS;
		instance.search('proj', query, ['ID']).then(
			function(data) {
				util.log('Search success. Received data:');
				console.log(util.inspect(data, {colors:true}));
				for(var i=0; i<data.length; ++i) {
					deleteProject(data[i].ID);
				}
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
