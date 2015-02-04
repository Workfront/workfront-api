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
 * Logs in, then creates a group "Api Group", edits the name to read "Api Group 2", then deletes it.
 * This examples is similar to create-edit-delete-group.js, but this one makes use of promise chaining (pc).
 */

var ApiFactory = require('./../../').ApiFactory;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

var login = function() {
	util.log('Logging in ...');
	return instance.login('new@user.attask', 'user');
};

var createGroup = function() {
	util.log('Creating new group ...');
	return instance.create('group', {name: 'Api Group'});
};

var editGroup = function(data) {
	util.log('Create success. Received data:');
	console.log(util.inspect(data, {colors:true}));
	return instance.edit('group', data.ID, {
		name: 'Api Group 2'
	}, ['ID'])
};

var deleteGroup = function(data) {
	util.log('Edit success. Received data:');
	console.log(util.inspect(data, {colors:true}));
	return instance.remove('group', data.ID);
};

util.print('Logs in, then creates a group "Api Group", edits the name to read "Api Group 2", then deletes it\n');

login().then(createGroup).then(editGroup).then(deleteGroup).then(
	function() {
		util.log('Remove success');
	},
	function(error) {
		util.log('Error. Received data:');
		console.log(util.inspect(error, {colors:true}));
	}
);
