// this files defines globals which can be used in tests

var chai = require('chai');
chai.use(require('chai-as-promised'));

chai.use(require('sinon-chai'));

global.chai = chai;

global.expect = chai.expect;

global.sinon = require('sinon');

require('promise/polyfill');
require('sinon-as-promised')(Promise);
