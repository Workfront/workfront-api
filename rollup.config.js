import typescript from '@rollup/plugin-typescript'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import {terser} from 'rollup-plugin-terser'

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
        plugins: [typescript(), nodeResolve(), commonjs()],
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
                module: 'es6',
            }),
            nodeResolve(),
            commonjs(),
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
        plugins: [typescript(), nodeResolve(), commonjs(), terser()],
    },
    {
        input: 'src/node.ts',
        output: {
            file: `dist/${name}.cjs.js`,
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        },
        plugins: [typescript(), commonjs({extensions: ['.js', '.ts']})],
        external: ['tslib', 'form-data', 'isomorphic-fetch', 'workfront-api-constants'],
    },
]
