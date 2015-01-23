/**
 * Logs in, then creates a new project with name "API Project"
 */

var ApiFactory = require('./../../').ApiFactory;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

util.print('Logs in, then creates a new project with name "API Project Shared" and then shares it\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Creating new project ...');
		instance.create('proj', {name: 'API Project Shared', description: 'This project has been created using API'}, ['accessRules:*']).then(
			function(data) {
				util.log('Create success. Received data:');
				console.log(util.inspect(data, {colors:true}));
				util.log('Sharing ...');
				var accessRules = data.accessRules;
				accessRules.push({
					objCode: 'ACSRUL',
					securityObjID: data.ID,
					securityObjCode: 'PROJ',
					accessorID: '543d165c00000008a75ac16cf38fb970',
					accessorObjCode: 'USER',
					coreAction: 'EDIT',
					secondaryActions:[],
					forbiddenActions:[]
				});
				instance.edit('proj', data.ID, {
					accessRules: accessRules
				}).then(
					function(data) {
						util.log('Share success. Received data:');
						console.log(util.inspect(data, {colors:true}));
					},
					function(error) {
						util.log('Share failure. Received data:');
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
