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
		api.request.resolves(true);
		var promise = api.logout();
		expect(promise).to.be.fulfilled.then(function () {
			expect(api.httpOptions.headers.sessionID).to.equal(undefined);
			done();
		});
	});
});