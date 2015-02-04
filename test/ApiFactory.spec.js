/**
 * Copyright 2015 Workfront
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('./common');
var ApiFactory = require('./../').ApiFactory;
var Api = require('./../').Api;


describe('ApiFactory.getInstance() when called for the frist time', function() {
	it('should throw when called for the first time without config', function(){
		expect(function() {
			ApiFactory.getInstance()
		}).to.throw('Please provide configuration as an object');
	});
});


describe('ApiFactory.getInstance() when called multiple times', function() {
	var firstInstance;

	beforeEach(function() {
		firstInstance = ApiFactory.getInstance({
			url: 'http://foo'
		});
	});

	afterEach(function() {
		ApiFactory.deleteInstance();
		firstInstance = undefined;
	});

	it('should return Api instance when called for the first time', function(){
		expect(firstInstance).to.be.instanceOf(Api);
	});

	it('should return the same Api instance when called for the second time', function(){
		var instance2 = ApiFactory.getInstance();
		expect(instance2).to.equal(firstInstance);
	});

	it('should return the same Api instance when called for the second time with another config and with 1 argument', function(){
		var instance2 = ApiFactory.getInstance({
			url: 'http://bar'
		});
		expect(instance2).to.equal(firstInstance);
	});

	it('should return another instance when called with 2 arguments for the second time', function(){
		var instance2 = ApiFactory.getInstance({
			url: 'http://bar'
		}, true);
		expect(instance2).not.to.equal(firstInstance);
	});
});