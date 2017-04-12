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
import * as should from 'should'

import {GROUPBY} from 'workfront-api-constants'
import * as Workfront from '../../src/index'

const API_URL = 'http://foobar:8080'

describe('Report', function() {

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
            `begin:${API_URL}/attask/api/`,
            require('../../fixtures/report.json'),
            {
                name: 'report'
            }
        )
    })
    it('makes a request with proper params, url and method', function() {
        const objCode = 'TASK',
            query = {
                ['status' + GROUPBY]: true
            }
        return this.api.report(objCode, query).then(function(data) {
            const [url, opts] = fetchMock.lastCall('report')
            should(opts.method).equal('GET')
            should(opts.body).be.null()
            should(url).endWith(`${objCode}/report?status${GROUPBY}=true`)
            should(data).have.propertyByPath('CPL', 'dcount_ID').be.Number()
            should(data.CPL).have.property('status').be.equal('CPL')
        })
    })
})
