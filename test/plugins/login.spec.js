require('./../common');

var Api = require('./../../').Api;


describe('Api.login() method', function() {

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
		var username = 'bar',
			password = 'baz';
		api.login(username, password);
		expect(api.request).to.have.callCount(1);
		expect(api.request).to.have.been.calledWith("login", {username: username, password: password}, null, "POST");
	});

	it('should set sessionID in headers if login was ok', function(done) {
		expect(api.httpOptions.headers.sessionID).to.equal(undefined);
		api.request.resolves({
			sessionID: 123
		});
		var promise = api.login('a', 'b');
		expect(promise).to.be.fulfilled.then(function () {
			expect(api.httpOptions.headers.sessionID).to.equal(123);
			done();
		});
	});
});