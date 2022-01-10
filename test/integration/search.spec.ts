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

import fetchMock from 'fetch-mock'
import should from 'should'

import {MOD, Operators} from 'workfront-api-constants'
import {Api} from '../../src/Api'
import fixture from '../../fixtures/search.json'

const API_URL = 'http://foobar:8080'

describe('Search', function () {
    afterEach(() => fetchMock.reset())

    beforeEach(function () {
        this.api = new Api({
            url: API_URL,
        })
    })
    afterEach(function () {
        this.api = undefined
    })

    beforeEach(function () {
        fetchMock.mock(`begin:${API_URL}/attask/api`, fixture, {
            name: 'search',
        })
    })
    it('makes a search request with proper params', function () {
        const objCode = 'ROLE'
        this.api.search(objCode)
        const [url, opts] = fetchMock.lastCall('search')
        should(opts.method).equal('GET')
        should(url).endWith(objCode + '/search')
        should(opts.body).be.null()
    })
    it('makes a request with search criteria', function () {
        const objCode = 'ROLE',
            criteriaField = 'maxUsers',
            criteriaValue = 5,
            query = {
                [criteriaField + MOD]: Operators.GREATERTHAN,
                [criteriaField]: criteriaValue,
            }
        this.api.search(objCode, query)
        const [url, opts] = fetchMock.lastCall('search')
        should(url).endWith(
            `${objCode}/search?${criteriaField}${MOD}=${Operators.GREATERTHAN}&${criteriaField}=${criteriaValue}`
        )
        should(opts.body).be.null()
    })
})
