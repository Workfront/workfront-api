require('./../common');

var Api = require('./../../').Api;


describe('Api.edit() method', function() {

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
		var updates = {
			'foo': 'bar'
		};

		var fields = [
			'*', "zzz:*"
		];

		var objCode = 'baz',
			objID = 'baz345';

		var expectedReturnValue = 123;
		api.request.returns(expectedReturnValue);

		var actualReturnedValue = api.edit(objCode, objID, updates, fields);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith(objCode + '/' + objID, {updates: JSON.stringify(updates)}, fields, "PUT");
		expect(actualReturnedValue).to.equal(expectedReturnValue);
	});
});