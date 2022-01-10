'use strict'

const CI_MODE = process.env.CI_MODE

module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'karma-typescript'],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/whatwg-fetch/dist/fetch.umd.js',
            'node_modules/fetch-mock/es5/client-legacy-bundle.js',
            'node_modules/should/should.js',
            {
                pattern: 'test/integration/*.spec.ts',
                watched: false,
            },
            'src/Api.ts',
        ],

        proxies: {
            //TODO  Make sure to list proxies for requests to server which you can't mock here
            //NOTE  The path part '/base/' points to root folder of the package.
            //NOTE  The common case is to sent clear.cache.gif instead of image.
            //'/user/avatar': '/base/mock/clear.cache.gif'
        },

        preprocessors: {
            '**/*.ts': 'karma-typescript',
        },

        karmaTypescriptConfig: {
            tsconfig: './tsconfig.json',
            include: ['test'],
            exclude: ['node_modules'],
            reports: {
                html: {directory: 'coverage'},
                'text-summary': '',
                lcovonly: '',
            },
            bundlerOptions: {
                transforms: [require('karma-typescript-es6-transform')()],
            },
        },

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        reporters: ['progress', 'karma-typescript'],

        port: 9876,
        colors: true,
        autoWatch: false,
        browsers: ['ChromeHeadless'],
        singleRun: true,
    })

    if (CI_MODE === 'saucelabs' && process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
        const chrome = {
            SL_Chrome_Latest: {
                version: 'latest',
                platform: 'OS X 10.11',
                browserName: 'chrome',
                base: 'SauceLabs',
            },
            'SL_Chrome_Latest-1': {
                version: 'latest-1',
                platform: 'OS X 10.11',
                browserName: 'chrome',
                base: 'SauceLabs',
            },
            'SL_Chrome_Latest-2': {
                version: 'latest-2',
                platform: 'OS X 10.11',
                browserName: 'chrome',
                base: 'SauceLabs',
            },
        }
        const firefox = {
            SL_Firefox_Latest: {
                version: 'latest',
                platform: 'OS X 10.11',
                browserName: 'firefox',
                base: 'SauceLabs',
            },
            'SL_Firefox_Latest-1': {
                version: 'latest-1',
                platform: 'OS X 10.11',
                browserName: 'firefox',
                base: 'SauceLabs',
            },
            'SL_Firefox_Latest-2': {
                version: 'latest-2',
                platform: 'OS X 10.11',
                browserName: 'firefox',
                base: 'SauceLabs',
            },
        }
        const safari = {
            SL_Safari_Latest: {
                version: 'latest',
                platform: 'OS X 10.12',
                browserName: 'safari',
                base: 'SauceLabs',
            },
            SL_Safari_10: {
                version: '10.0',
                platform: 'OS X 10.11',
                browserName: 'safari',
                base: 'SauceLabs',
            },
            SL_Safari_9: {
                version: '9.0',
                platform: 'OS X 10.11',
                browserName: 'safari',
                base: 'SauceLabs',
            },
        }
        const edge = {
            SL_Edge_Latest: {
                version: 'latest',
                platform: 'Windows 10',
                browserName: 'MicrosoftEdge',
                base: 'SauceLabs',
            },
        }
        const linux = {
            SL_Chrome_Linux: {
                version: 'latest',
                platform: 'Linux',
                browserName: 'chrome',
                base: 'SauceLabs',
            },
            SL_Firefox_Linux: {
                version: 'latest',
                platform: 'Linux',
                browserName: 'firefox',
                base: 'SauceLabs',
            },
        }

        // Browsers to run on Sauce Labs
        const customLaunchers = Object.assign({}, chrome, firefox, safari, edge, linux)

        // Override config for CI.
        config.set({
            reporters: ['progress', 'saucelabs', 'karma-typescript'],
            sauceLabs: {
                build: process.env.GITHUB_SHA,
                connectOptions: {
                    connectRetries: 1,
                    doctor: true,
                    verbose: true,
                },
                commandTimeout: 300,
                idleTimeout: 600,
                maxDuration: 1800,
                public: 'public',
                recordScreenshots: false,
                recordVideo: false,
                startConnect: false,
                testName: 'workfront-api',
                tunnelIdentifier: 'github-action-tunnel',
            },
            captureTimeout: 0,
            customLaunchers: customLaunchers,

            // start these browsers
            // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
            browsers: Object.keys(customLaunchers),
        })
    }
}
