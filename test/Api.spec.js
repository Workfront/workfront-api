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

require('./common');
var Api = require('./../').Api;


describe('Create new instance for API', function() {
	it('should have methods', function() {
		var api = new Api({url: 'http://localhost'});
		expect(api).to.respondTo('get');
		expect(api).to.respondTo('login');
		expect(api).to.respondTo('logout');
		expect(api).to.respondTo('create');
		expect(api).to.respondTo('edit');
		expect(api).to.respondTo('search');
		expect(api).to.respondTo('remove');
		expect(api).to.respondTo('report');
		expect(api).to.respondTo('count');
		expect(api).to.respondTo('copy');
		expect(api).to.respondTo('upload');
		expect(api).to.respondTo('execute');
		expect(api).to.respondTo('namedQuery');
		expect(api).to.respondTo('metadata');
	});

	it('should set correct API path based on passed configuration (version is passed)', function() {
		var api = new Api({url: 'http://localhost', version: '2.0'});
		expect(api.httpOptions.path).to.equal('/attask/api/v2.0');
	});

	it('should set correct API path based on passed configuration (version is not passed)', function() {
		var api = new Api({url: 'http://localhost'});
		expect(api.httpOptions.path).to.equal('/attask/api');
	});

	it('should set correct API path based on passed configuration (version="internal")', function() {
		var api = new Api({url: 'http://localhost', version: 'internal'});
		expect(api.httpOptions.path).to.equal('/attask/api-internal');
	});
});