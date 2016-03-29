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

require('./../common');

var Api = require('./../../').Api;


describe('Api.login() method', function() {

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
		var username = 'bar',
			password = 'baz';
		api.request.resolves();
		api.login(username, password);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith("login", {username: username, password: password}, null, "POST");
	});

	it('should set sessionID in headers if login was ok', function(done) {
		expect(api.httpOptions.headers.sessionID).to.equal(undefined);
		api.request.resolves({
			sessionID: 123
		});
		var promise = api.login('a', 'b');
		expect(promise).to.be.fulfilled.then(function () {
			expect(api.httpOptions.headers.sessionID).to.equal(123);
			done();
		});
	});
});