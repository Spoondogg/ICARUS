/** Gulp paths are relative to the root directory */
export const GULPPATHS = {
	styles: {
		baseglob: 'Content/styles/**/**.*',
		base: 'Content/styles/src/icarus',
		basefile: './Content/styles/src/icarus/icarus.scss',
		dest: 'Content/styles/dist/icarus',
		src: 'Content/styles/src/icarus/**/*.scss'
	},
	scripts: {
		buildglob: 'Scripts/**/**.*',
		base: 'Scripts/src/icarus',
		baseglob: './Scripts/src/**/**.js',
		src: ['Scripts/src/icarus/**/*.js'],
		dest: 'Scripts/dist/icarus'
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
		//buildglob: 'Scripts/test/**/**.*',
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
		beautify: '../config/beautify.json',
		doxygen: '../config/doxygen.json',
		eslint: '../config/eslint.json',
		sasslint: '../config/sasslint.json',
		jsdoc: '../config/jsdoc.json'
	}
};