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

import * as fetchMock from 'fetch-mock'
import should from 'should'

import * as Workfront from '../../src/index'

const API_URL = 'http://foobar:8080'

describe('Batch', function() {

    afterEach(fetchMock.reset)
    afterEach(fetchMock.restore)

    beforeEach(function() {
        this.api = new Workfront.Api({
            url: API_URL
        })
    })
    afterEach(function() {
        this.api = undefined
    })

	beforeEach(function() {
		fetchMock.mock(
			`begin:${API_URL}/attask/api`,
            require('../../fixtures/batch.json'),
			{
				name: 'any'
			}
		)
	})

	it('should not make any network calls in uriCollector callback', function() {
		this.api.batch(
            batchApi => [
				batchApi.copy('foo', 'bar', {name: 'Copy of bar'}),
				batchApi.count('USER', {}),
				batchApi.create('baz', {
					foo: 'bar'
				}, ['*', 'zzz:*']),
				batchApi.edit('PROJ', 'foobar', {
					name: 'api test 2'
				}),
				batchApi.execute('foo', 'bar', 'baz'),
				batchApi.get('foo', 'bar'),
                batchApi.metadata('TASK', ['collections']),
				batchApi.namedQuery('foo', 'action'),
				batchApi.remove('foo', 'objID'),
				batchApi.report('task', {
					'status_GroupBy': true
				}),
				batchApi.search('role', {
					'status_GroupBy': true
				})
			],
            false
        )
        should(fetchMock.calls().length).equal(1)
	})
})
