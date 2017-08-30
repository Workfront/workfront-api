'use strict'

const CI = process.env.CI
const CI_MODE = process.env.CI_MODE

process.env.WEBPACK_ENV = 'test'

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/es6-promise/dist/es6-promise.auto.min.js',
            'node_modules/whatwg-fetch/fetch.js',
            'test/test-bundle.js'
        ],

        proxies: {
            //TODO  Make sure to list proxies for requests to server which you can't mock here
            //NOTE  The path part '/base/' points to root folder of the package.
            //NOTE  The common case is to sent clear.cache.gif instead of image.
            //'/user/avatar': '/base/mock/clear.cache.gif'
        },

        preprocessors: {
            'test/test-bundle.js': ['webpack', 'sourcemap']
        },

        webpack: require('./webpack.config'),

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        reporters: ['progress', 'coverage', 'remap-coverage'],

        coverageReporter: {
            type: 'in-memory'
        },

        remapOptions: {
            // warn: function() {}
        },
        remapCoverageReporter: (function () {
            if (CI) {
                return {
                    'text-summary': null,
                    lcovonly: './coverage/lcov.info'
                }
            }
            return {
                'text-summary': null,
                // to show summary in console
                html: './coverage'
            }
        })(),

        port: 9876,
        colors: true,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true
    })

    if (CI_MODE === 'saucelabs' && process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
        const chrome = {
            'SL_Chrome_Latest': {version: 'latest', platform: 'OS X 10.11', browserName: 'chrome', base: 'SauceLabs'},
            'SL_Chrome_Latest-1': {version: 'latest-1', platform: 'OS X 10.11', browserName: 'chrome', base: 'SauceLabs'},
            'SL_Chrome_Latest-2': {version: 'latest-2', platform: 'OS X 10.11', browserName: 'chrome', base: 'SauceLabs'}
        }
        const firefox = {
            'SL_Firefox_Latest': {version: 'latest', platform: 'OS X 10.11', browserName: 'firefox', base: 'SauceLabs'},
            'SL_Firefox_Latest-1': {version: 'latest-1', platform: 'OS X 10.11', browserName: 'firefox', base: 'SauceLabs'},
            'SL_Firefox_Latest-2': {version: 'latest-2', platform: 'OS X 10.11', browserName: 'firefox', base: 'SauceLabs'}
        }
        const safari = {
            'SL_Safari_Latest': {version: 'latest', platform: 'OS X 10.12', browserName: 'safari', base: 'SauceLabs'},
            'SL_Safari_10': {version: '10.0', platform: 'OS X 10.11', browserName: 'safari', base: 'SauceLabs'},
            'SL_Safari_9': {version: '9.0', platform: 'OS X 10.11', browserName: 'safari', base: 'SauceLabs'}
        }
        const ie = {
            'SL_InternetExplorer_11': {version: '11.0', platform: 'Windows 7', browserName: 'internet explorer', base: 'SauceLabs'},
            'SL_InternetExplorer_10': {version: '10.0', platform: 'Windows 7', browserName: 'internet explorer', base: 'SauceLabs'},
            'SL_InternetExplorer_9': {version: '9.0', platform: 'Windows 7', browserName: 'internet explorer', base: 'SauceLabs'}
        }
        const edge = {
            'SL_Edge_Latest': {version: 'latest', platform: 'Windows 10', browserName: 'MicrosoftEdge', base: 'SauceLabs'},
            'SL_Edge_14': {version: '14.14393', platform: 'Windows 10', browserName: 'MicrosoftEdge', base: 'SauceLabs'},
            'SL_Edge_13': {version: '13.10586', platform: 'Windows 10', browserName: 'MicrosoftEdge', base: 'SauceLabs'}
        }
        const linux = {
            'SL_Chrome_Linux': {version: 'latest', platform: 'Linux', browserName: 'chrome', base: 'SauceLabs'},
            'SL_Firefox_Linux': {version: 'latest', platform: 'Linux', browserName: 'firefox', base: 'SauceLabs'},
        }

        // Browsers to run on Sauce Labs
        const customLaunchers = Object.assign({}, chrome, firefox, safari, ie, edge, linux)

        // Override config for CI.
        config.set({
            reporters: ['progress', 'saucelabs'],
            sauceLabs: {
                build: 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')',
                connectOptions: {
                    connectRetries: 1,
                    doctor: true,
                    verbose: true
                },
                commandTimeout: 600,
                idleTimeout: 180,
                maxDuration: 3600,
                public: 'public',
                recordScreenshots: false,
                recordVideo: false,
                startConnect: false,
                testName: 'workfront-api',
                tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
            },
            captureTimeout: 0,
            customLaunchers: customLaunchers,

            // start these browsers
            // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
            browsers: Object.keys(customLaunchers)
        })
    }
}