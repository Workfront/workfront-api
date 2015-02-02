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

require('./../common');

var Api = require('./../../').Api;


describe('Api.execute() method', function() {

	var api;
	var url = 'http://foobar:8080';

	beforeEach(function () {
		api = new Api({url: url});
		sinon.stub(api, "request");
	});

	afterEach(function () {
		api.request.restore(); // Unwraps the spy
	});

	it('should call request() with proper params (without args)', function() {
		api.execute('foo', '123', 'doSomething');
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith('foo/123/doSomething', undefined, null, "PUT");
	});

	it('should call request() with proper params (with args)', function() {
		api.execute('foo', '123', 'doSomething', {objID: 111});
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith('foo/123/doSomething', {objID: 111}, null, "PUT");
	});
});