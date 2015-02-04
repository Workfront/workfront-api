/**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
