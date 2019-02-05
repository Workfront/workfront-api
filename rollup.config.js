import typescript from 'rollup-plugin-typescript'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

const name = 'workfront-api'

const umdOptions = (minify) => ({
    input: 'src/Api.ts',
    output: {
        file: minify ? `dist/${name}.umd.min.js` : `dist/${name}.umd.js`,
        format: 'umd',
        name: 'Workfront',
        sourcemap: true
    },
    plugins: [ typescript(), resolve(), commonjs(), minify ? terser() : undefined ],
})
const esOptions = () => ({
    input: 'src/Api.ts',
    output: {
        file: `dist/${name}.es.js`,
        format: 'esm',
        sourcemap: true
    },
    plugins: [ typescript(), resolve(), commonjs() ],
})
const cjsOptions = () => ({
    input: 'src/node.ts',
    output: {
        file: `dist/${name}.cjs.js`,
        format: 'cjs',
        sourcemap: true
    },
    plugins: [ typescript(), terser() ],
    external: ['form-data', 'isomorphic-fetch', 'workfront-api-constants']
})

module.exports = [umdOptions(), esOptions(), umdOptions(true), cjsOptions()]
