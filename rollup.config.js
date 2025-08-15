const typescript = require('@rollup/plugin-typescript')
const {nodeResolve} = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const terser = require('@rollup/plugin-terser')

const name = 'workfront-api'

module.exports = [
    {
        input: 'src/Api.ts',
        output: [
            {
                file: `dist/${name}.umd.js`,
                format: 'umd',
                name: 'Workfront',
                sourcemap: true,
            },
        ],
        plugins: [typescript({module: 'es2020'}), nodeResolve(), commonjs()],
    },
    {
        input: 'src/Api.ts',
        output: [
            {
                file: `dist/${name}.es.js`,
                format: 'esm',
                sourcemap: true,
            },
        ],
        plugins: [
            typescript({
                module: 'es2020',
            }),
            nodeResolve(),
            commonjs({defaultIsModuleExports: true}),
        ],
    },
    {
        input: 'src/Api.ts',
        output: {
            file: `dist/${name}.umd.min.js`,
            format: 'umd',
            name: 'Wokfront',
            sourcemap: true,
        },
        plugins: [typescript({module: 'es2020'}), nodeResolve(), commonjs(), terser()],
    },
    {
        input: 'src/node.ts',
        output: {
            file: `dist/${name}.cjs.js`,
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        },
        plugins: [typescript({module: 'es2020'}), commonjs({extensions: ['.js', '.ts']})],
        external: ['tslib', 'form-data', 'isomorphic-fetch', '@workfront/api-constants'],
    },
]
