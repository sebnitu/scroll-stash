import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const entry = 'src/main.js';
const name = 'ScrollStash';

export default [{
  input: entry,
  output: [{
    file: 'dist/scripts.js',
    format: 'iife',
    name: name,
    extend: true,
  }, {
    file: 'dist/scripts.cjs',
    format: 'cjs',
    name: name,
    exports: 'default'
  }],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      rootMode: 'upward',
    })
  ]
}, {
  input: entry,
  output: {
    file: 'dist/scripts.min.js',
    format: 'iife',
    name: name,
    extend: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'runtime',
      rootMode: 'upward',
    }),
    terser()
  ]
}];
