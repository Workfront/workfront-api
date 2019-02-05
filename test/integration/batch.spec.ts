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
import {Api} from '../../dist/index.es'
import fixture from '../../fixtures/batch.json'

const API_URL = 'http://foobar:8080'

describe('Batch', function() {

    afterEach(fetchMock.reset)
    afterEach(fetchMock.restore)

    beforeEach(function() {
        this.api = new Api({
            url: API_URL
        })
    })
    afterEach(function() {
        this.api = undefined
    })

	beforeEach(function() {
		fetchMock.mock(
			`begin:${API_URL}/attask/api`,
            fixture,
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

	describe('batch header and body', function () {
		beforeEach(function () {
			this.api.batch(
				batchApi => [
					batchApi.search('user'),
					batchApi.search('team'),
					batchApi.search('role')
				]
			)
		})

		it('should make a http call with post method', function() {
			should(fetchMock.lastUrl()).equal(API_URL + '/attask/api-internal/batch')
			should(fetchMock.lastOptions()).have.property('method', 'POST')
		})

		it('should contain 3 uri params in its body', function() {
			const {body} = fetchMock.lastOptions()
			const match = decodeURIComponent(body).match(/uri/ig)
			should(match).not.empty()
			should(match).has.length(3, 'should have 3 uri params')
		})

		it('should contain 3 method=GET params in its body', function() {
			const {body} = fetchMock.lastOptions()
			const match = decodeURIComponent(body).match(/method=GET/ig)
			should(match).not.empty()
			should(match).has.length(3, 'should have 3 method=GET params')
		})
	})
})
