/**
 * Copyright 2015 AtTask
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
 * Logs in, loads list of active users, then calls assignUserToken action for the first user
 */

var ApiFactory = require('./../../').ApiFactory;
var ApiConstants = require('./../../').ApiConstants;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

util.print('Logs in, loads list of active users, then calls assignUserToken action for the first user\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Loading list of active users ...');
		var query = {};
		query['isActive'] = true;
		query[ApiConstants.LIMIT] = 1;
		instance.search('user', query).then(
			function(data) {
				util.log('Load success. Received data:');
				console.log(util.inspect(data, {colors:true}));
				util.log('Calling action for user with objID=' + data[0].ID + ' ...');
				instance.execute('user', data[0].ID, 'assignUserToken').then(
					function(data) {
						util.log('Action success. Received data:');
						console.log(util.inspect(data, {colors:true}));
					},
					function(error) {
						util.log('Action failure. Received data:');
						console.log(util.inspect(error, {colors:true}));
					}
				);
			},
			function(error) {
				util.log('Load failure. Received data:');
				console.log(util.inspect(error, {colors:true}));
			}
		);
	},
	function(error) {
		util.log('Login failure. Received data:');
		console.log(util.inspect(error, {colors:true}));
	}
);
