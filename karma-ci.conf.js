'use strict'

const karmaConfig = require('./karma.conf');

const CI = process.env.CI

if(CI === 'TRAVIS') {
    module.exports = karmaConfig
}
else if (CI === 'SL') {
    module.exports = function (config) {
        karmaConfig(config)

        // Browsers to run on Sauce Labs
        const customLaunchers = {
        'SL_Chrome': {
            base: 'SauceLabs',
            browserName: 'chrome',
            version: '48.0',
            platform: 'Linux'
            },
        'SL_Chrome56': {
            base: 'SauceLabs',
            browserName: 'chrome',
            version: '56.0',
            platform: 'OS X 10.12'
            },
        'SL_Chrome55': {
            base: 'SauceLabs',
            browserName: 'chrome',
            version: '55.0',
            platform: 'OS X 10.12'
            },
        'SL_Firefox50': {
            base: 'SauceLabs',
            browserName: 'firefox',
            version: '50.0',
            platform: 'Windows 10'
            },
        'SL_Firefox51': {
            base: 'SauceLabs',
            browserName: 'firefox',
            version: '51.0',
            platform: 'Windows 10'
            },
        'SL_InternetExplorer10': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11.0',
            platform: 'Windows 7'
            },
        'SL_InternetExplorer11': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11.0',
            platform: 'Windows 7'
            },
        'SL_Edge13': {
            base: 'SauceLabs',
            browserName: 'microsoftedge',
            version: '13.0',
            platform: 'Windows 10'
            },
        'SL_Safari10': {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.12',
            version: '10.0'
            },
        'SL_Safari9': {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.11',
            version: '9.0'
            }
        };

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