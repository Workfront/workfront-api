var expect = require('chai').expect;

var ApiFactory = require('./../src/ApiFactory');
var Api = require('./../src/Api');


describe('Api.getInstance() when called for the frist time', function() {
	it('should throw when called for the first time without config', function(){
		expect(function() {
			ApiFactory.getInstance()
		}).to.throw('Please provide configuration as an object');
	});
});


describe('Api.getInstance() when called multiple times', function() {
	var firstInstance;

	beforeEach(function() {
		firstInstance = ApiFactory.getInstance({
			hostname: 'foo'
		});
	});

	afterEach(function() {
		ApiFactory.deleteInstance();
		firstInstance = undefined;
	});

	it('should return Api instance when called for the first time', function(){
		expect(firstInstance).to.exist();
		expect(firstInstance).to.be.instanceOf(Api);
	});

	it('should return the same Api instance when called for the second time', function(){
		var instance2 = ApiFactory.getInstance();
		expect(instance2).to.equal(firstInstance);
	});

	it('should return another instance when called with 2 arguments for the second time', function(){
		var instance2 = ApiFactory.getInstance({
			hostname: 'bar'
		}, true);
		expect(instance2).not.to.equal(firstInstance);
	});

	it('should throw when called for the second time with another config and with 1 argument', function(){
		expect(function() {
			ApiFactory.getInstance({
				hostname: 'bar'
			});
		}).to.throw('To create a new instance you have to pass a second argument (true)');
	});
});