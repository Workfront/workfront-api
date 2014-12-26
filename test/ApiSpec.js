var expect = require('chai').expect;

var Api = require('./../src/Api');


describe('Create new instance for API', function() {
	it('should have methods', function(){
		var api = new Api({hostname: 'localhost'});
		expect(api).to.respondTo('get');
		expect(api).to.respondTo('login');
		expect(api).to.respondTo('logout');
		expect(api).to.respondTo('post');
		expect(api).to.respondTo('put');
		expect(api).to.respondTo('search');
		expect(api).to.respondTo('delete');
		expect(api).to.respondTo('report');
		expect(api).to.respondTo('count');
		expect(api).to.respondTo('copy');
		expect(api).to.respondTo('upload');
		expect(api).to.respondTo('execute');
		expect(api).to.respondTo('namedQuery');
		expect(api).to.respondTo('metadata');
	});
});