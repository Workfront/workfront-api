'use strict'

const CI = process.env.CI

const webpackConfig = require('./webpack.config')
webpackConfig.devtool = 'inline-source-map'

webpackConfig.resolve.alias = webpackConfig.resolve.alias || {}

// Conditional requires workaround (https://github.com/sinonjs/sinon/issues/830)
webpackConfig.resolve.alias.sinon ='sinon/pkg/sinon'

webpackConfig.module.rules = webpackConfig.module.rules || []
webpackConfig.module.rules.push({
    test: /\.[tj]s$/,
    enforce: 'post',
    exclude: /(test-bundle\.js|\.spec|node_modules|mock|\.mock|\.stub)/,
    use: {
        loader: 'istanbul-instrumenter-loader',
        options: {
            esModules: true,
            produceSourceMap: true
        }
    }
})

webpackConfig.externals = [
]

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
            'node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
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

        webpack: webpackConfig,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        reporters: ['progress', 'coverage', 'remap-coverage'],

        coverageReporter: {
            reporters: [
                {type: 'in-memory'},
                // generates ./coverage/lcov.info
                {type: CI ? 'lcovonly' : 'html', subdir: '.'}
            ]
        },

        remapOptions: {
            warn: function() {}
        },
        remapCoverageReporter: {
            'text-summary': null, // to show summary in console
            html: './coverage'
        },

        port: 9876,
        colors: true,
        autoWatch: false,
        browsers: ['PhantomJS'],
        singleRun: true
    })
}