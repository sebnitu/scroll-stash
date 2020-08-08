import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const babelConfig = {
  babelHelpers: 'runtime',
  rootMode: 'upward',
};

export default [{
  input: 'src/main.js',
  output: {
    file: 'dist/scripts.cjs.js',
    format: 'cjs',
    exports: 'default'
  }, plugins: [
    resolve(),
    commonjs(),
    babel(babelConfig)
  ]
}, {
  input: 'src/main.js',
  output: {
    file: 'dist/scripts.js',
    format: 'iife',
    name: 'ScrollStash'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel(babelConfig)
  ]
}, {
  input: 'src/main.js',
  output: {
    file: 'dist/scripts.min.js',
    format: 'iife',
    name: 'ScrollStash'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel(babelConfig),
    terser()
  ]
}];
