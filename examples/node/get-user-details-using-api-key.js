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
 * Obtains an API key, returns detailed info of logged in user using that key, and then clears the key
 */

var ApiFactory = require('./../../').ApiFactory;
var ApiConstants = require('./../../').ApiConstants;
var util = require('util');

var instance = ApiFactory.getInstance({
	url: 'http://localhost:8080',
	version: 'unsupported'
});


var getApiKey = function() {
    util.log('Obtaining API key ...');
    return instance.getApiKey('new@user.attask', 'user');
};

var getUserInfo = function(apiKey) {
    util.log('Obtained API key ' + apiKey);
    util.log('Getting logged in user info ...');
    return instance.get('user', ApiConstants.WildCards.USER, '*');
};

var clearApiKey = function(data) {
    util.log('Get success. Received data:');
    console.log(util.inspect(data, {colors:true}));
    util.log('Releasing API key ...');
    return instance.clearApiKey();
};

getApiKey().then(getUserInfo).then(clearApiKey).then(
    function() {
        util.log('Success');
    },
    function(error) {
        util.log('Error. Received data:');
        console.log(util.inspect(error, {colors:true}));
    }
);
