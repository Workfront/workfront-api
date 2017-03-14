'use strict'

const karmaConfig = require('./karma.conf');

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
            browser: 'internet explorer',
            browser_version: '11.0',
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
        // sauceLabs: {
        //     testName: 'workfront-api CI tests',
        //     recordScreenshots: false,
        //     connectOptions: {
        //         port: 5757
        //     },
        //     public: 'public'
        // },
        // captureTimeout: 120000,
        browserStack: {
            username: process.env.BROWSERSTACK_USER,
            accessKey: process.env.BROWSERSTACK_ACCESSKEY,
        },
        customLaunchers: customLaunchers,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: Object.keys(customLaunchers),
        singleRun: true
    })

}
