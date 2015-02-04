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

// this files defines globals which can be used in tests

var chai = require('chai');
chai.use(require('chai-as-promised'));

chai.use(require('sinon-chai'));

global.chai = chai;

global.expect = chai.expect;

global.sinon = require('sinon');

require('promise/polyfill');
require('sinon-as-promised')(Promise);
