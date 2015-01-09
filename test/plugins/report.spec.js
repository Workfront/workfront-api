require('./../common');

var Api = require('./../../').Api;
var ApiConstants = require('./../../').ApiConstants;


describe('Api.report() method', function() {

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
		var query = {
			'foo': 'bar'
		};

		var objCode = 'baz';

		var expectedReturnValue = 123;
		api.request.returns(expectedReturnValue);

		var actualReturnedValue = api.report(objCode, query);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith(objCode + "/report", query, null, "GET");
		expect(actualReturnedValue).to.equal(expectedReturnValue);
	});
});