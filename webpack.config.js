'use strict'

module.exports = {
    entry: './src/index.ts',
    output: {
        path: __dirname + '/dist',
        filename: 'workfront.js',
        library: 'Workfront',
        libraryTarget: 'umd'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    resolve: {
        // Add '.ts' and '.js' as resolvable extensions.
        extensions: ['.ts', '.js']
    },

    module: {
        rules: [
            // rules for modules (configure loaders, parser options, etc.)
            // All files with a '.ts' extension will be handled by 'awesome-typescript-loader'.
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                exclude: [
                    /(node_modules)/,
                    /(test)/
                ]
            },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            },

            // lint
            {
                enforce: 'pre',
                test: /\.ts$/,
                loader: 'tslint-loader',
                exclude: /(node_modules)/,
                options: {
                    // failOnHint: true
                }
            }
        ],
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: [
        'isomorphic-fetch'
    ]
};
