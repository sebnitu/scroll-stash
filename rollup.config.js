import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const entry = 'src/index.js';
const name = 'ScrollStash';

export default [{
  input: entry,
  output: {
    file: 'dist/scripts.esm.js',
    format: 'es'
  },
  plugins: [babel({ babelHelpers: 'bundled' })]
}, {
  input: entry,
  output: {
    file: 'dist/scripts.js',
    format: 'umd',
    name: name
  },
  plugins: [babel({ babelHelpers: 'bundled' })]
}, {
  input: entry,
  output: {
    file: 'dist/scripts.min.js',
    format: 'umd',
    name: name
  },
  plugins: [
    babel({ babelHelpers: 'bundled' }),
    terser()
  ]
}];
