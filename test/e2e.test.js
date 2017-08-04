const fs = require('fs')
const should = require('should')
const ApiConstants = require('workfront-api-constants');
const uuidv1 = require('uuid/v1')

const Workfront = require('./../')

describe('E2E Tests', function () {
    const objToRemove = []
    const rootTestTitle = this.title
    let customerID, resellerID, accountRepID
    let USERNAME = 'new@user.attask', PASSWORD = 'user'

    if (process.env.CI) {
        before('Create Test Customer', function () {
            this.aspInstance = new Workfront.Api({
                url: 'http://localhost:8080',
                version: 'asp'
            })
            const testName = this.currentTest ? this.currentTest.title : rootTestTitle
            const uuid = uuidv1()
            return this.aspInstance.login('asproot', 'user').then(() => {
                return this.aspInstance.create('Reseller', {
                    name: 'TestAdmin_' + uuid
                }).then((data) => {
                    resellerID = data.ID
                    USERNAME = uuid + '@test.attask'
                    return this.aspInstance.create('AccountRep', {
                        adminLevel: 'A', // ADMIN
                        resellerID,
                        firstName: 'Test',
                        lastName: 'Test',
                        username: 'Test' + uuid,
                        password: 'password'
                    }).then((data) => {
                        accountRepID = data.ID
                        return this.aspInstance.create('Customer', {
                            accountRepID,
                            adminAcctName: USERNAME,
                            allowAPIKey: true,
                            currency: 'USD',
                            description: 'This is a test customer!',
                            domain: uuid,
                            isAPIEnabled: true,
                            journalFieldLimit: 300,
                            locale: 'US',
                            name: 'Test_' + testName + '_' + uuid,
                            needLicenseAgreement: false,
                            onDemandOptions: 'PWDDISAB', // PASSWORD_COMPLEXITY_DISABLE
                            securityModelType: 'D', // Lucid
                            status: 'A', // ACTIVE
                            timeZone: 'UTC',
                        }).then((data) => {
                            customerID = data.ID
                            return this.aspInstance.create('LicenseOrder', {
                                isEnterprise: true,
                                isSOAPEnabled: true,
                                isAPIEnabled: true,
                                fullUsers: 1000,
                                teamUsers: 1000,
                                limitedUsers: 1000,
                                requestorUsers: 1000,
                                reviewUsers: 1000,
                                customerID,
                            })
                        })
                    })
                })
            })
        })
        after('Delete Test Customer', function () {
            return this.aspInstance.edit('Customer', customerID, {
                isDisabled: true,
                domain: null
            }).then(() => (
                this.aspInstance.remove('Customer', customerID).then(() => (
                    Promise.all([
                        this.aspInstance.remove('Reseller', resellerID),
                        this.aspInstance.remove('AccountRep', accountRepID)
                    ])
                ))
            ))
        })
    }

    beforeEach(function () {
        this.instance = new Workfront.Api({
            url: 'http://localhost:8080',
            version: '8.0'
        })
    })

    function putObjToRemoveQueue(obj) {
        objToRemove.push([obj.objCode, obj.ID])
        return obj
    }

    beforeEach(function () {
        objToRemove.length = 0
    })
    afterEach(function () {
        let queue = Promise.resolve()
        objToRemove.reverse().forEach(([objCode, objID]) => {
            queue = queue.then(() => this.instance.remove(objCode, objID, true))
        })
        return queue
    })

    describe('Login with username and password', function () {
        beforeEach(function () {
            return this.instance.login(USERNAME, PASSWORD).then((data) => {
                should(data).have.properties('userID', 'sessionID')
                should.ok(true, 'user logged in')
            }).catch((err) => console.error(err.message))
        })

        it.skip('Loads list of user notes, then calls acknowledge action for the one', function () {
            const query = {}
            query[ApiConstants.LIMIT] = 1
            return this.instance.search('USRNOT', query).then((data) => {
                should(data).be.Array()
                should(data[0]).have.property('ID')
                return this.instance.execute('ack', null, 'acknowledge', {
                    objID: data[0].ID,
                    objCode: 'USRNOT'
                }).then((data) => {
                    should(data).be.Object()
                })
            })
        })

        it('Loads list of active users, then calls assignUserToken action for the first user', function () {
            const query = {};
            query['isActive'] = true;
            query[ApiConstants.LIMIT] = 1;
            return this.instance.search('USER', query).then((data) => {
                should(data).be.Array()
                should(data[0]).have.property('ID')
                return this.instance.execute('USER', data[0].ID, 'assignUserToken').then((data) => {
                    should(data).be.Object()
                })
            })
        })

        it('Creates a new template with name "API Template", then removes it', function () {
            return this.instance.create('tmpl', {
                name: 'API Template',
                description: 'This template has been created using API'
            }).then((data) => {
                should(data).have.property('ID')
                return this.instance.remove('tmpl', data.ID, true).then((data) => {
                    should(data).be.undefined()
                })
            })
        })

        it('Creates a group "Api Group", edits the name to read "Api Group 2", then deletes it', function () {
            return this.instance.create('group', {name: 'Api Group'}).then((data) => {
                return this.instance.edit('group', data.ID, {name: 'Api Group 2'}, ['ID']).then((data) => (
                    this.instance.remove('group', data.ID)
                ))
            })
        })

        it('Creates a new project with name "API Project"', function () {
            const name = 'API Project'
            const description = 'This project has been created using API'
            const objCode = 'PROJ'
            return this.instance.create('proj', {name, description}, ['description'])
                .then(putObjToRemoveQueue).then((data) => {
                    should(data).have.property('ID')
                    should(data).have.properties({objCode, name, description})
                })
        })

        it('Creates a new project with name "API Project Shared" and then shares it', function () {
            const name = 'API Project'
            const description = 'This project has been created using API'
            const objCode = 'PROJ'
            const newUsername = uuidv1() + '@bar.baz'
            return this.instance.create('USER', {
                name: 'foo',
                username: newUsername,
                emailAddr: newUsername,
            }).then(putObjToRemoveQueue).then((data) => {
                should(data).have.property('ID')
                const userID = data.ID
                return this.instance.create(objCode, {name, description}, ['accessRules:*'])
                    .then(putObjToRemoveQueue).then((data) => {
                        should(data).have.properties('ID', 'accessRules')
                        should(data).have.properties({objCode, name})
                        const accessRules = data.accessRules
                        accessRules.push({
                            objCode: 'ACSRUL',
                            securityObjID: data.ID,
                            securityObjCode: objCode,
                            accessorID: userID,
                            accessorObjCode: 'USER',
                            coreAction: 'EDIT',
                            secondaryActions: [],
                            forbiddenActions: []
                        })
                        return this.instance.edit(objCode, data.ID, {accessRules: accessRules}).then((data) => {
                            should(data).be.Object()
                            should(data).have.property('ID').eql(data.ID)
                        })
                    })
            })
        })

        it('Creates a new project with name "API Project", then copies it', function () {
            const name = 'API Project'
            const copyName = 'API Project Copy'
            const description = 'This project has been created using API'
            const objCode = 'PROJ'
            return this.instance.create(objCode, {name, description}).then(putObjToRemoveQueue).then((data) => {
                const originalProjectID = data.ID
                return this.instance.copy(objCode, originalProjectID, {name: copyName})
                    .then(putObjToRemoveQueue)
                    .then((data) => {
                        should(data).have.property('ID').not.eql(originalProjectID)
                    })
            })
        })

        it('Deletes all projects with name containing "API Project', function () {
            const query = {}
            query['name'] = 'API Project'
            query['name' + ApiConstants.MOD] = ApiConstants.Operators.CONTAINS
            return Promise.all([
                this.instance.create('PROJ', {name: query.name, description: 'Some description...'}),
                this.instance.create('PROJ', {name: query.name, description: 'Some description...'}),
                this.instance.create('PROJ', {name: query.name, description: 'Some description...'}),
                this.instance.create('PROJ', {name: query.name, description: 'Some description...'})
            ]).then((values) => {
                should(values).have.length(4)
                return this.instance.search('PROJ', query, ['ID']).then((data) => (
                    Promise.all(data.map((project) => this.instance.remove('PROJ', project.ID, true)))
                ))
            })
        })

        it('Returns metadata about available API resources', function () {
            return this.instance.metadata().then((data) => {
                should(data).have.propertyByPath('objects', 'Project')
                should(data).have.propertyByPath('objects', 'User')
                should(data).have.propertyByPath('objects', 'Task')
            })
        })

        it('Queries details of multiple tasks', function () {
            return this.instance.create('PROJ', {name: 'baz'}).then(putObjToRemoveQueue).then((data) => {
                const projectID = data.ID
                return Promise.all([
                    this.instance.create('TASK', {name: 'foo', projectID}).then(putObjToRemoveQueue),
                    this.instance.create('TASK', {name: 'bar', projectID}).then(putObjToRemoveQueue)
                ]).then(([taskFoo, taskBar]) => {
                    should(taskFoo).have.property('ID')
                    should(taskBar).have.property('ID')
                    should(taskFoo).have.property('name').eql('foo')
                    should(taskBar).have.property('name').eql('bar')
                    return this.instance.get('TASK', [taskFoo.ID, taskBar.ID], ['*']).then((data) => {
                        should(data).be.Array()
                        should(data).have.length(2)
                        should(data[0]).have.properties({ID: taskFoo.ID, name: taskFoo.name})
                        should(data[1]).have.properties({ID: taskBar.ID, name: taskBar.name})
                    })
                })
            })
        })

        it('Queries project and project owner details by project id', function () {
            return this.instance.create('PROJ', {name: 'baz'}).then(putObjToRemoveQueue).then(({ID}) => {
                return this.instance.get('PROJ', ID, ['*', 'owner:*']).then((data) => {
                    should(data).have.property('owner')
                    should(data.owner).be.Object()
                    should(data.owner).have.property('username').eql(USERNAME)
                })
            })
        })

        it('Queries metadata for the task object (objCode: TASK)', function () {
            return this.instance.metadata('TASK').then((data) => {
                should(data).have.property('name').eql('Task')
                should(data).have.property('objCode').eql('TASK')
                should(data).have.property('fields').be.Object()
            })
        })

        it('Returns number of active users', function () {
            const query = {};
            query['isActive'] = true;
            query['isActive' + ApiConstants.MOD] = ApiConstants.Operators.EQUAL;
            return this.instance.count('USER', query).then((data) => {
                should(data).be.Number()
            })
        })

        it('Calls myWork named query for Work object (Items in My Work)', function () {
            return this.instance.namedQuery('work', 'myWork').then((data) => {
                should(data).be.Array()
            })
        })

        it('Returns list of hours grouped by project names', function () {
            const query = {}
            query['project:name_1' + ApiConstants.GROUPBY] = true
            query['hours' + ApiConstants.AGGFUNC] = ApiConstants.Functions.SUM
            return this.instance.report('HOUR', query).then((data) => {
                should(data).be.Object()
            })
        })

        it('Search for projects with percentComplete > 0', function () {
            this.instance.search('PROJ', {percentComplete: 0, percentComplete_Mod: 'gt'}).then((data) => {
                should(data).be.Array()
            })
        })

        it('Uploads an image and delete it afterwards', function () {
            const stream = fs.createReadStream(__dirname + '/../examples/node/image.jpg');
            return this.instance.create('PROJ', {
                name: 'Project for Document',
                description: 'Upload image for Project'
            }).then(putObjToRemoveQueue).then((data) => {
                const projectID = data.ID
                return this.instance.uploadFromStream(stream, 'wf-logo.jpg').then((data) => {
                    should(data).have.property('handle').length(32)
                    return this.instance.create('DOCU', {
                        name: 'Workfront Logo',
                        handle: data.handle,
                        docObjCode: 'PROJ',

                        //Obviously this will work with a real PROJ ID
                        objID: projectID
                    }).then((data) => {
                        should(data).have.property('name').eql('Workfront Logo')
                        return this.instance.remove('DOCU', data.ID)
                    })
                })
            })
        })

        it('Creates Rate executing setRatesForRole action', function () {
            return Promise.all([
                this.instance.create('PROJ', {name: 'BillingRate Project'}).then(putObjToRemoveQueue),
                this.instance.create('ROLE', {name: 'Role for test'}).then(putObjToRemoveQueue)
            ]).then(([project, role]) => (
                this.instance.execute('RATE', null, 'setRatesForRole', {
                    updates: JSON.stringify({
                        attachableID: project.ID,
                        attachableObjCode: project.objCode,
                        roleID: role.ID,
                        rates: [
                            {
                                value: '10',
                                startDate: null,
                                endDate: '2017-07-28'
                            },
                            {
                                value: '20',
                                startDate: '2017-07-29',
                                endDate: '2017-08-04'
                            },
                            {
                                value: '30',
                                startDate: '2017-08-05',
                                endDate: null
                            }
                        ]
                    })
                })
            ))
        })
    })

    describe('With no auto-login in beforeEach', function () {
        it('Gets apiKey for the User, gets user\'s details, clear the apiKey', function () {
            return this.instance.getApiKey(USERNAME, PASSWORD).then((data) => {
                should(data).be.String().length(32)
                return this.instance.get('USER', ApiConstants.WildCards.USER, '*').then((data) => {
                    should(data).have.property('ID')
                    should(data).have.property('username').eql(USERNAME)
                    return this.instance.clearApiKey()
                })
            })
        })

        it('Creates a new project with name "API Project" using a GET request', function () {
            const instance = new Workfront.Api({
                url: 'http://localhost:8080',
                version: '7.0',
                alwaysUseGet: true
            })
            return instance.login(USERNAME, PASSWORD).then(() => (
                instance.create('PROJ', {
                    name: 'API Project',
                    description: 'This project has been created using API'
                }).then((data) => {
                    should(data).have.properties('ID', 'objCode')
                    return instance.remove(data.objCode, data.ID, true)
                })
            ))
        })

        it('Creates a group "Api Group", edits the name to read "Api Group 2", then deletes it -- Chained', function () {
            const login = () => this.instance.login(USERNAME, PASSWORD)
            const createGroup = () => this.instance.create('group', {name: 'Api Group'})
            const editGroup = (data) => this.instance.edit('group', data.ID, {name: 'Api Group 2'}, ['ID'])
            const deleteGroup = (data) => this.instance.remove('group', data.ID)

            return login().then(createGroup).then(editGroup).then(deleteGroup)
        })

        it('Logs in and logs out', function () {
            return this.instance.login(USERNAME, PASSWORD).then((data) => {
                should(data).have.properties('userID', 'sessionID')
                return this.instance.logout()
            })
        })
    })
})
