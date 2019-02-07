/** Gulp paths are relative to the root directory */
export const GULPPATHS = {
	styles: {
		baseglob: 'Content/styles/**/**.*',
		base: 'Content/styles/src/icarus',
		basefile: './Content/styles/src/icarus/icarus.scss',
		dest: 'Content/styles',
		src: 'Content/styles/src/icarus/**/*.scss'
	},
	fonts: {
		dest: 'Content/fonts'
	},
	scripts: {
		//buildglob: 'Scripts/**/**.*',
		base: 'Scripts/src/icarus',
		baseglob: 'Scripts/src/**/**.js',
		src: ['Scripts/src/icarus/**/*.js'],
		dest: 'Scripts'
	},
	serverside: {
		cs: ['Controllers/**/**.cs', 'Models/Icarus/**/**.cs'],
		cshtml: 'Views/**/**.cshtml'
	},
	images: {
		src: 'Content/Images/**/*.{jpg,jpeg,png}',
		dest: 'build/img/'
	},
	tests: {
		src: 'Scripts/test/specs/**/*.js',
		base: 'Scripts/test',
		baseglob: 'Scripts/test/specs/**/*.js'
	},
	tasks: {
		src: 'gulpfile.babel.js'
	},
	server: {
		dev: 'I://iis/dev/',
		prod: 'I://iis/icarus/'
	},
	config: {
		beautify: '../../config/beautify.json',
		doxygen: '../../config/doxygen.json',
		eslint: '../../config/eslint.json',
		sasslint: '../../config/sasslint.json',
		jsdoc: '../../config/jsdoc.json'
	}
};