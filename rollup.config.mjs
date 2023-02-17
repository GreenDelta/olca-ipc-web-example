import typescript from 'rollup-plugin-typescript2';

export default {
	input: 'main.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'umd',
      name: 'app'
    }
  ],

	plugins: [
		typescript(/*{ plugin options }*/)
	]
}