require('./../common');
var nock = require('nock');

var Api = require('./../../').Api;


describe('Api. request() method', function() {

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
});