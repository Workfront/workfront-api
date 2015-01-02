require('./../common');

var Api = require('./../../').Api;


describe('Api.get() method', function() {

	var api;
	var url = 'http://foobar:8080';

	beforeEach(function () {
		api = new Api({url: url});
		sinon.stub(api, "request");
	});

	afterEach(function () {
		api.request.restore(); // Unwraps the spy
	});

	it('should call request() with proper params and return value received from request() if called with single objId (String)', function() {
		var objId = 'myid';

		var fields = [
			'*', "zzz:*"
		];

		var objCode = 'baz';

		var expectedReturnValue = 123;
		api.request.returns(expectedReturnValue);

		var actualReturnedValue = api.get(objCode, objId, fields);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith(objCode + '/' + objId, null, fields, "GET");
		expect(actualReturnedValue).to.equal(expectedReturnValue);
	});

	it('should call request() with proper params and return value received from request() if called with single objId (Array)', function() {
		var objId = ['myid'];

		var fields = [
			'*', "zzz:*"
		];

		var objCode = 'baz';

		var expectedReturnValue = 123;
		api.request.returns(expectedReturnValue);

		var actualReturnedValue = api.get(objCode, objId, fields);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith(objCode + '/' + objId, null, fields, "GET");
		expect(actualReturnedValue).to.equal(expectedReturnValue);
	});

	it('should call request() with proper params and return value received from request() if called with multiple objIds', function() {
		var objIds = ['myid1', 'myid2'];

		var fields = [
			'*', "zzz:*"
		];

		var objCode = 'baz';

		var expectedReturnValue = 123;
		api.request.returns(expectedReturnValue);

		var actualReturnedValue = api.get(objCode, objIds, fields);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith(objCode, { id: objIds }, fields, "GET");
		expect(actualReturnedValue).to.equal(expectedReturnValue);
	});
});