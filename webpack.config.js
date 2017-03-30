'use strict'

const WEBPACK_ENV = process.env.WEBPACK_ENV

module.exports = {
    context: __dirname,
    entry: './src/Api.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'workfront.js',
        library: 'Workfront',
        libraryTarget: 'umd'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: WEBPACK_ENV === 'test' ? 'inline-source-map' : 'source-map',

    resolve: {
        // Add '.ts' and '.js' as resolvable extensions.
        extensions: ['.ts', '.js']
    },

    module: {
        rules: (function() {
            const rules = [
                // rules for modules (configure loaders, parser options, etc.)
                // All files with a '.ts' extension will be handled by 'ts-loader'.
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: (function() {
                                if (WEBPACK_ENV === 'test') {
                                    return {
                                        compilerOptions: {
                                            sourceMap: false,
                                            inlineSourceMap: true
                                        }
                                    }
                                }
                                return {
                                    compilerOptions: {
                                        sourceMap: true
                                    }
                                }
                            })()
                        }
                    ],
                    exclude: /node_modules/
                },

                // lint
                {
                    enforce: 'pre',
                    test: /\.ts$/,
                    loader: 'tslint-loader',
                    exclude: /node_modules/,
                    options: {
                        // failOnHint: true
                    }
                }
            ]
            if (WEBPACK_ENV === 'test') {
                rules.push({
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
            }
            return rules
        })()
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: (function() {
        if (WEBPACK_ENV === 'test') {
            return []
        }
        return [
            'isomorphic-fetch',
            'form-data'
        ]
    })()
};
