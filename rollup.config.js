import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const entry = 'index.js';
const name = 'ScrollStash';

export default [{
  input: entry,
  output: {
    file: 'dist/scripts.js',
    format: 'umd',
    name: name
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled'
    })
  ]
}, {
  input: entry,
  output: {
    file: 'dist/scripts.min.js',
    format: 'umd',
    name: name
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled'
    }),
    terser()
  ]
}, {
  input: entry,
  output: {
    file: 'dist/scripts.esm.js',
    format: 'es'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled'
    })
  ]
}];
