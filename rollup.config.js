import pkg from './package.json'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
const outputOptions = {
  exports: 'named',
  globals: {
    history: 'History',
    'path-to-regex': 'PathToRegex',
    vue: 'Vue',
  },
}
export default {
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  input: './src/index.ts',
  output: [
    {
      ...outputOptions,
      file: pkg.main,
      format: 'cjs',
    },
    {
      ...outputOptions,
      file: pkg.module,
      format: 'es',
    },
    {
      ...outputOptions,
      file: pkg.unpkg,
      format: 'umd',
      name: 'vueRouterDom',
    },
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    resolve(),
    terser(),
  ],
}
