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


describe('Api.copy() method', function() {

	var api;
	var url = 'http://foobar:8080';

	beforeEach(function () {
		api = new Api({url: url});
		sinon.stub(api, "request");
	});

	afterEach(function () {
		api.request.restore(); // Unwraps the spy
	});

	it('should call request() with proper params and return value received from request() (with updates)', function() {
		var updates = {
			'foo': 'bar'
		};

		var objCode = 'baz',
			objID = 'baz345';

		var expectedReturnValue = 123;
		api.request.returns(expectedReturnValue);

		var actualReturnedValue = api.copy(objCode, objID, updates);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith(objCode, {copySourceID: objID, updates: JSON.stringify(updates)}, undefined, "POST");
		expect(actualReturnedValue).to.equal(expectedReturnValue);
	});

	it('should call request() with proper params and return value received from request() (without updates)', function() {
		var objCode = 'baz',
			objID = 'baz345';

		var expectedReturnValue = 123;
		api.request.returns(expectedReturnValue);

		var actualReturnedValue = api.copy(objCode, objID);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith(objCode, {copySourceID: objID}, undefined, "POST");
		expect(actualReturnedValue).to.equal(expectedReturnValue);
	});
});