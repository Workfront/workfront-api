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
 * Logs in, loads list of user notes, then calls acknowledge action for the one
 */
'use strict';
var Workfront = require('./../../');
var ApiConstants = require('workfront-api-constants');
var util = require('util');

var instance = new Workfront.Api({
	url: 'http://localhost:8080',
	version: 'internal'
});

console.log('Logs in, loads list of user notes, then calls acknowledge action for the one\n');
util.log('Logging in ...');
instance.login('new@user.attask', 'user').then(
	function(data) {
		util.log('Loading list of user notes ...');
		var query = {};
		query[ApiConstants.LIMIT] = 1;
		instance.search('USRNOT', query).then(
			function(data) {
				util.log('Load success. Received data:');
				console.log(util.inspect(data, {colors:true}));
				util.log('Calling action for user note with objID=' + data[0].ID + ' ...');
				instance.execute('ack', null, 'acknowledge', {objID: data[0].ID, objCode:'USRNOT'}).then(
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
