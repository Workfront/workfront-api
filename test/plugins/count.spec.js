require('./../common');

var Api = require('./../../').Api;
var ApiConstants = require('./../../').ApiConstants;


describe('Api.count() method', function() {

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
		var query = {
			'foo': 'bar'
		};

		var objCode = 'baz';

		api.count(objCode, query);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith(objCode + "/count", query, null, "GET");
	});

	it('should resolve returned promise with count if everything was ok', function() {
		var c = 7;
		api.request.resolves({count: c});
		expect(api.count('foo', {})).to.eventually.equal(c);
	});
});