require('./../common');

var Api = require('./../../').Api;


describe('Api.remove() method', function() {

	var api;
	var url = 'http://foobar:8080';

	beforeEach(function () {
		api = new Api({url: url});
		sinon.stub(api, "request");
	});

	afterEach(function () {
		api.request.restore(); // Unwraps the spy
	});

	it('should call request() with proper params (force=false)', function() {
		api.remove('foo', '123');
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith('foo/123', null, null, "DELETE");
	});

	it('should call request() with proper params (force=true)', function() {
		api.remove('foo', '123', true);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith('foo/123', {force: true}, null, "DELETE");
	});

	it('should resolve returned promise if removal was ok', function(done) {
		api.request.resolves({success: true});
		var promise = api.remove('foo', '123', true);
		expect(promise).to.be.fulfilled.and.notify(done);
	});

	it('should reject returned promise if removal was not ok', function(done) {
		api.request.resolves(false);
		var promise = api.remove('foo', '123');
		expect(promise).to.be.rejected.and.notify(done);
	});

	it('should reject returned promise if removal was not ok (request() rejected)', function(done) {
		api.request.rejects();
		var promise = api.remove('foo', '123');
		expect(promise).to.be.rejected.and.notify(done);
	});
});