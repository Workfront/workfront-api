require('./../common');

var Api = require('./../../').Api;


describe('Api.namedQuery() method', function() {

	var api;
	var url = 'http://foobar:8080';

	beforeEach(function () {
		api = new Api({url: url});
		sinon.stub(api, "request");
	});

	afterEach(function () {
		api.request.restore(); // Unwraps the spy
	});

	it('should call request() with proper params and return value received from request()', function() {
		var queryArgs = {
			'foo': 'bar'
		};

		var fields = [
			'*', "zzz:*"
		];

		var objCode = 'baz';

		var query = 'myQuery';

		var expectedReturnValue = 123;
		api.request.returns(expectedReturnValue);

		var actualReturnedValue = api.namedQuery(objCode, query, queryArgs, fields);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith(objCode + "/" + query, queryArgs, fields, "GET");
		expect(actualReturnedValue).to.equal(expectedReturnValue);
	});
});