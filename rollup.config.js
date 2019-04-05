import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const name = 'workfront-api'

module.exports = [
    {
        input: 'src/Api.ts',
        output: [
            {
                file: `dist/${name}.es.js`,
                format: 'esm',
                sourcemap: true
            },
            {
                file: `dist/${name}.umd.js`,
                format: 'umd',
                name: 'Workfront',
                sourcemap: true
            },
        ],
        plugins: [ typescript(), resolve(), commonjs() ]
    },
    {
        input: 'src/Api.ts',
        output: {
            file: `dist/${name}.umd.min.js`,
            format: 'umd',
            name: 'Wokfront',
            sourcemap: true
        },
        plugins: [ typescript(), resolve(), commonjs(), terser() ]
    },
    {
        input: 'src/node.ts',
        output: {
            file: `dist/${name}.cjs.js`,
            format: 'cjs',
            sourcemap: true
        },
        plugins: [ typescript() ],
        external: ['form-data', 'isomorphic-fetch', 'workfront-api-constants']
    }
]
