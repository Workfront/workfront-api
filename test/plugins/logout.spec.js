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


describe('Api.logout() method', function() {

	var api;
	var url = 'http://foobar:8080';

	beforeEach(function () {
		api = new Api({url: url});
		sinon.stub(api, "request");
	});

	afterEach(function () {
		api.request.restore(); // Unwraps the spy
	});

	it('should call request() with proper params', function() {
		api.logout();
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith("logout", null, null, "GET");
	});

	it('should remove sessionID from headers if logout was ok', function(done) {
		api.httpOptions.headers.sessionID = 123;
		api.request.resolves({success: true});
		var promise = api.logout();
		expect(promise).to.be.fulfilled.then(function () {
			expect(api.httpOptions.headers.sessionID).to.equal(undefined);
			done();
		});
	});

	it('should reject returned promise and dont touch sessionID if logout was not ok', function(done) {
		api.httpOptions.headers.sessionID = 123;
		api.request.resolves(false);
		var promise = api.logout();
		expect(promise).to.be.rejected.then(function () {
			expect(api.httpOptions.headers.sessionID).to.equal(123);
			done();
		});
	});
});