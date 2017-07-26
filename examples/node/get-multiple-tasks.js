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
 * Logs in, queries details of multiple tasks
 */

'use strict';
var Workfront = require('./../../');
var util = require('util');

var instance = new Workfront.Api({
    url: 'http://localhost:8080',
    version: '7.0'
});


console.log('Logs in, queries details of multiple tasks\n');
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
