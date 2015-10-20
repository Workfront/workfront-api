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
 * Logs in, then uploads an image and attaches it to a task
 */

var ApiFactory = require('./../../').ApiFactory;
var util = require('util');
var fs = require('fs');

var stream = fs.createReadStream('./image.jpg');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: '4.0'
});

util.log('Logging in ...');
instance.login('admin@user.attask', 'user').then(
	function() {
		util.log('Uploading a sweet picture...');
		instance.upload(stream, {filename: 'sweet.jpg', contentType: 'image/jpeg'}).then(
			function(data) {
				util.log('Upload success. Received data:');
				console.log(util.inspect(data, {colors:true}));

        instance.create('DOCU', {
					name: 'sweet.jpg',
          handle: data.handle,
          docObjCode: 'TASK',

          //Obviously this will only work with a real TASK ID
          objID: '561ffe36000006ee9f8453a6c921d636'
				}).then(
					function(data) {
						util.log('Document creation success. Received data:');
						console.log(util.inspect(data, {colors:true}));
          },
          function(error) {
            util.log('Document creation failure. Received data:');
            console.log(util.inspect(error, {colors:true}));
          }
        );
			},
			function(error) {
				util.log('Upload failure. Received data:');
				console.log(util.inspect(error, {colors:true}));
			}
		);
	},
	function(error) {
		util.log('Login failure. Received data:');
		console.log(util.inspect(error, {colors:true}));
	}
);
