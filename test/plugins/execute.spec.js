require('./../common');

var Api = require('./../../').Api;


describe('Api.execute() method', function() {

	var api;
	var url = 'http://foobar:8080';

	beforeEach(function () {
		api = new Api({url: url});
		sinon.stub(api, "request");
	});

	afterEach(function () {
		api.request.restore(); // Unwraps the spy
	});

	it('should call request() with proper params (without args)', function() {
		api.execute('foo', '123', 'doSomething');
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith('foo/123/doSomething', undefined, null, "PUT");
	});

	it('should call request() with proper params (with args)', function() {
		api.execute('foo', '123', 'doSomething', {objID: 111});
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith('foo/123/doSomething', {objID: 111}, null, "PUT");
	});
});