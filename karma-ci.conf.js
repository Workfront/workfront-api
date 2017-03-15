'use strict'

const karmaConfig = require('./karma.conf');

const CI = process.env.CI

if(CI === 'TRAVIS') {
    module.exports = karmaConfig
}
else if (CI === 'SL') {
    module.exports = function (config) {
        karmaConfig(config)

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
            reporters: ['spec', 'coverage', 'saucelabs'],
            sauceLabs: {
                testName: 'workfront-api',
                recordScreenshots: false,
                recordVideo: false,
                connectOptions: {
                    port: 5757
                },
                public: 'public'
            },
            captureTimeout: 120000,
            customLaunchers: customLaunchers,

            // start these browsers
            // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
            browsers: Object.keys(customLaunchers),
            singleRun: true
        })
    }
}
else {
    console.log('Please specify CI environment variable')
}