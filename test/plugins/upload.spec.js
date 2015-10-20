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

require('./../common');
var nock = require('nock');
var fs = require('fs');

var Api = require('./../../').Api;


describe('Api.upload() method', function() {
	it('should call upload() with proper params and file contents and return value received from upload()', function(done) {
    var content = ['Content-Disposition: form-data; name="uploadedFile"; filename="sample.file"',
      'Content-Type: false',
      'Here is some sample content that needs to be uploaded.',
      'It is a few lines.'
    ].join(' ');

    var url = 'http://foobar:8000';
    nock(url)
      .post('/attask/api/upload')
      .reply(200, function(uri, requestBody){
        expect(requestBody.replace(/[\n\r]+/g, ' ')).to.contain(content);

        return {
          data: {
            'handle': '3cbd483b0ebe45a78492a08f95f2eb88'
          }
        };
      });

    var api = new Api({url: url});
    var stream = fs.createReadStream('./test/plugins/sample.file');
    var promise = api.upload(stream);
    expect(promise).to.eventually.deep.equal({'handle': '3cbd483b0ebe45a78492a08f95f2eb88'}).and.notify(done);
	});

	it('should allow for overriding filename and content type', function(done) {
    var content = ['Content-Disposition: form-data; name="uploadedFile"; filename="test.txt"',
      'Content-Type: text/plain',
      'Here is some sample content that needs to be uploaded.',
      'It is a few lines.'
    ].join(' ');

    var url = 'http://foobar:8000';
    nock(url)
      .post('/attask/api/upload')
      .reply(200, function(uri, requestBody){
        expect(requestBody.replace(/[\n\r]+/g, ' ')).to.contain(content);

        return {
          data: {
            'handle': '3cbd483b0ebe45a78492a08f95f2eb88'
          }
        };
      });

    var api = new Api({url: url});
    var stream = fs.createReadStream('./test/plugins/sample.file');
    var promise = api.upload(stream, {
      filename: 'test.txt',
      contentType: 'text/plain'
    });
    expect(promise).to.eventually.deep.equal({'handle': '3cbd483b0ebe45a78492a08f95f2eb88'}).and.notify(done);
	});
});
