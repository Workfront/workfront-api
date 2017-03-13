'use strict'

const karmaConfig = require('./karma.conf');

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
        'SL_Firefox': {
            base: 'SauceLabs',
            browserName: 'firefox',
            version: '50.0',
            platform: 'Windows 10'
        },
        'SL_InternetExplorer': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11.0',
            platform: 'Windows 7'
        },
        'SL_Safari': {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.11',
            version: '10.0'
        }
    };

    // Override config for CI.
    config.set({
        reporters: ['spec', 'coverage', 'saucelabs'],
        sauceLabs: {
            testName: 'Karma and Sauce Labs demo'
        },
        captureTimeout: 120000,
        customLaunchers: customLaunchers,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: Object.keys(customLaunchers),
        singleRun: true
    })

}
