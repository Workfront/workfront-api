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
var nock = require('nock');

var Api = require('./../../').Api;


describe('Api.request() method', function() {

	it('should resolve returned promise with data if everything went ok', function(done) {
		var url = 'http://foobar:8080',
			path = '/test',
			params = {
				'foo': 1,
				'bar': 'baz'
			},
			fields = [
				'*', 'owner:*'
			],
			method = 'GET';

		nock(url)
			.get('/attask/api' + path + '?foo=1&bar=baz&fields=*%2Cowner%3A*')
			.reply(200, {
				data: {
					'got': 'ok'
				}
			});

		var api = new Api({url: url});
		var promise = api.request(path, params, fields, method);
		expect(promise).to.eventually.deep.equal({'got': 'ok'}).and.notify(done);
	});


    it('should resolve returned promise with data if everything went ok when fields are specified as string', function(done) {
        var url = 'http://foobar:8080',
            path = '/test',
            params = {
                'foo': 1,
                'bar': 'baz'
            },
            fields = '*',
            method = 'GET';

        nock(url)
            .get('/attask/api' + path + '?foo=1&bar=baz&fields=*')
            .reply(200, {
                data: {
                    'got': 'ok'
                }
            });

        var api = new Api({url: url});
        var promise = api.request(path, params, fields, method);
        expect(promise).to.eventually.deep.equal({'got': 'ok'}).and.notify(done);
    });


	it('should resolve returned promise with data if everything went ok when using POST', function(done) {
		var url = 'http://foobar:8080',
			path = '/test',
			params = {
				'foo': 1,
				'bar': 'baz'
			},
			fields = [
				'*', 'owner:*'
			],
			method = 'POST';

		nock(url)
			.post('/attask/api' + path, 'foo=1&bar=baz&fields=*%2Cowner%3A*')
			.reply(200, {
				data: {
					'got': 'ok'
				}
			});

		var api = new Api({url: url});
		var promise = api.request(path, params, fields, method);
		expect(promise).to.eventually.deep.equal({'got': 'ok'}).and.notify(done);
	});


	it('should resolve returned promise with data if everything went ok (empty fields)', function(done) {
		var url = 'http://foobar:8080',
			path = '/test',
			params = {
				'foo': 1,
				'bar': 'baz'
			},
			fields = [],
			method = 'GET';

		nock(url)
			.get('/attask/api' + path + '?foo=1&bar=baz')
			.reply(200, {
				data: {
					'got': 'ok'
				}
			});

		var api = new Api({url: url});
		var promise = api.request(path, params, fields, method);
		expect(promise).to.eventually.deep.equal({'got': 'ok'}).and.notify(done);
	});


	it('should resolve returned promise with data if everything went ok (without fields)', function(done) {
		var url = 'http://foobar:8080',
			path = '/test',
			params = {
				'foo': 1,
				'bar': 'baz'
			},
			method = 'GET';

		nock(url)
			.get('/attask/api' + path + '?foo=1&bar=baz')
			.reply(200, {
				data: {
					'got': 'ok'
				}
			});

		var api = new Api({url: url});
		var promise = api.request(path, params, null, method);
		expect(promise).to.eventually.deep.equal({'got': 'ok'}).and.notify(done);
	});


	it('should resolve returned promise with data if everything went ok (without fields and params)', function(done) {
		var url = 'http://foobar:8080',
			path = '/test',
			method = 'GET';

		nock(url)
			.get('/attask/api' + path)
			.reply(200, {
				data: {
					'got': 'ok'
				}
			});

		var api = new Api({url: url});
		var promise = api.request(path, null, null, method);
		expect(promise).to.eventually.deep.equal({'got': 'ok'}).and.notify(done);
	});


	it('should resolve returned promise with data if everything went ok (path without leading /)', function(done) {
		var url = 'http://foobar:8080',
			path = 'test',
			params = {
				'foo': 1,
				'bar': 'baz'
			},
			fields = [],
			method = 'GET';

		nock(url)
			.get('/attask/api/' + path + '?foo=1&bar=baz')
			.reply(200, {
				data: {
					'got': 'ok'
				}
			});

		var api = new Api({url: url});
		var promise = api.request(path, params, fields, method);
		expect(promise).to.eventually.deep.equal({'got': 'ok'}).and.notify(done);
	});


	it('should reject returned promise with error data on error', function(done) {
		var url = 'http://foobar:8080',
			path = '/test',
			params = {
				'foo': 1,
				'bar': 'baz'
			},
			fields = [
				'*', 'owner:*'
			],
			method = 'GET';

		nock(url)
			.get('/attask/api' + path + '?foo=1&bar=baz&fields=*%2Cowner%3A*')
			.reply(500, {
				error: {
					'message': 'fail'
				}
			});

		var api = new Api({url: url});
		var promise = api.request(path, params, fields, method);
		expect(promise).to.be.rejectedWith({'message': 'fail'}).and.notify(done);
	});
    
    it('should only use get if alwaysUseGet is true', function(done) {
		var url = 'http://foobar:8080',
			path = '/test',
			method = 'DELETE',
            params = {force: true};

		nock(url)
			.get('/attask/api' + path + '?force=true&method=DELETE')
			.reply(200, {
				data: {
					'got': 'ok'
				}
			});

		var api = new Api({url: url, alwaysUseGet: true});
		var promise = api.request(path, params, undefined, method);
		expect(promise).to.eventually.deep.equal({'got': 'ok'}).and.notify(done);
	});
});