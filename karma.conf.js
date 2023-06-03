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
            'node_modules/fetch-mock/es5/client-bundle.js',
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
            SL_Chrome_Latest_Mac: {
                browserName: 'chrome',
                browserVersion: 'latest',
                platformName: 'macOS 13',
                base: 'SauceLabs',
            },
            SL_Chrome_Previous_Mac: {
                browserName: 'chrome',
                browserVersion: 'latest-1',
                platformName: 'macOS 12',
                base: 'SauceLabs',
            },
            SL_Chrome_Latest_Windows: {
                browserName: 'chrome',
                browserVersion: 'latest',
                platformName: 'Windows 11',
                base: 'SauceLabs',
            },
            SL_Chrome_Previous_Windows: {
                browserName: 'chrome',
                browserVersion: 'latest-1',
                platformName: 'Windows 10',
                base: 'SauceLabs',
            },
        }
        const firefox = {
            SL_Firefox_Latest_Windows: {
                browserName: 'firefox',
                browserVersion: 'latest',
                platformName: 'Windows 11',
                base: 'SauceLabs',
            },
            SL_Firefox_Latest_Mac: {
                browserName: 'firefox',
                browserVersion: 'latest',
                platformName: 'macOS 13',
                base: 'SauceLabs',
            },
        }
        const safari = {
            SL_Safari_Latest: {
                browserName: 'safari',
                browserVersion: '16',
                platformName: 'macOS 13',
                base: 'SauceLabs',
            },
            SL_Safari_Previous: {
                browserName: 'safari',
                browserVersion: '15',
                platformName: 'macOS 12',
                base: 'SauceLabs',
            },
        }
        const edge = {
            SL_Edge_Latest: {
                browserName: 'MicrosoftEdge',
                browserVersion: 'latest',
                platformName: 'Windows 11',
                base: 'SauceLabs',
            },
            SL_Edge_Previous: {
                browserName: 'MicrosoftEdge',
                browserVersion: 'latest-1',
                platformName: 'Windows 10',
                base: 'SauceLabs',
            },
        }

        // Browsers to run on Sauce Labs
        const customLaunchers = Object.assign({}, chrome, firefox, safari, edge)

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
