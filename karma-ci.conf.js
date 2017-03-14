'use strict'

const karmaConfig = require('./karma.conf');

const CI = process.env.CI

if(CI === 'TRAVIS') {
    module.exports = karmaConfig
}
else if (CI === 'BS') {
    module.exports = function (config) {
        karmaConfig(config)

        // Browsers to run on Sauce Labs
        const customLaunchers = {
            'bs_chrome_mac': {
                base: 'BrowserStack',
                browser: 'chrome',
                browser_version: '56.0',
                os: 'OS X',
                os_version: 'Sierra'
            },
            'bs_firefox_mac': {
                base: 'BrowserStack',
                browser: 'firefox',
                browser_version: '52.0',
                os: 'OS X',
                os_version: 'Sierra'
            },
            'bs_internet_explorer_win': {
                base: 'BrowserStack',
                browser: 'ie',
                browser_version: '11',
                os: 'Windows',
                os_version: '7'
            },
            'bs_safari_mac': {
                base: 'BrowserStack',
                browser: 'safari',
                browser_version: '10.0',
                os: 'OS X',
                os_version: 'Sierra'
            }
        };

        // Override config for CI.
        config.set({
            reporters: ['progress'],
            browserStack: {
                username: process.env.BROWSERSTACK_USER,
                accessKey: process.env.BROWSERSTACK_ACCESSKEY,
                project: 'workfront-api'
            },
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