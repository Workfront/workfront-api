import * as should from 'should'
import * as cjsModule from '../'

describe('Verify workfront-api cjs exported members', function () {
    it('exports cjs required members', function () {
        should(cjsModule).properties('Api', 'ResponseHandler', 'makeFetchCall')
    })
    it('has NodeApi as Api fallback', function () {
        should(cjsModule).properties('Api', 'NodeApi')
        should(cjsModule.Api).equals(cjsModule.NodeApi)
    })
    it('exports "default" for backward compatibility', function () {
        should(cjsModule).properties('default')
        should(cjsModule.default).property('Api', cjsModule.Api)
        should(cjsModule.default).property('NodeApi', cjsModule.NodeApi)
        should(cjsModule.default).property('ResponseHandler', cjsModule.ResponseHandler)
    })
})
