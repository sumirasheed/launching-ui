var settings = {
	clean: true,
	scripts: true,
	polyfills: true,
	styles: true,
	svgs: true,
	copy: true,
	reload: true,
	eachJS: false
};
var src_path = 'src/';
var dist_path = 'dist/';
var paths = {
	input: src_path,
	output: dist_path,
	scripts: {
		input: src_path + 'scripts/*',
		polyfills: '.polyfill.js',
		output: dist_path + 'scripts/',
		vendor: [
			'./node_modules/jquery/dist/jquery.min.js',
			'./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
			'./node_modules/slick-carousel/slick/slick.min.js',
			'./node_modules/gsap/src/minified/TweenMax.min.js',
			'./node_modules/aos/dist/aos.js'
		]
	},
	styles: {
		input: src_path + 'sass/*.{scss,sass}',
		output: dist_path + 'css/'
	},
	copy: {
		input: src_path + 'public/**/*',
		output: dist_path
	},
	reload: './' + dist_path
};

/**
 * Template for banner to add to file headers
 */

var banner = {
	full:
		'/*!\n' +
		' * <%= package.name %> v<%= package.version %>\n' +
		' * <%= package.description %>\n' +
		' * (c) ' + new Date().getFullYear() +
		' * <%= package.license %> License\n' +
		' */\n\n',
	min:
		'/*!' +
		' <%= package.name %> v<%= package.version %>' +
		' | (c) ' + new Date().getFullYear() +
		' | <%= package.license %> License' +
		' */\n'
};


// General
var {gulp, src, dest, watch, series, parallel} = require('gulp');
var del = require('del');
var flatmap = require('gulp-flatmap');
var lazypipe = require('lazypipe');
var rename = require('gulp-rename');
var header = require('gulp-header');
var packageJson = require('./package.json');

// Scripts
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var concat = require('gulp-concat');
var uglify = require('gulp-terser');
var optimizejs = require('gulp-optimize-js');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');

// Styles
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-cssnano');

// BrowserSync
var browserSync = require('browser-sync');

/**
 * Gulp Tasks
 */
var cleanDist = function (done) {

	// Make sure this feature is activated before running
	if (!settings.clean) return done();

	// Clean the dist folder
	del.sync([
		'/' + paths.output
	]);

	// Signal completion
	return done();
};

// Repeated JavaScript tasks with babel
var jsTasksBabel = lazypipe()
	.pipe(babel)
	.pipe(header, banner.full, {package: packageJson})
	.pipe(optimizejs)
	.pipe(sourcemaps.write)
	.pipe(dest, paths.scripts.output)
	.pipe(rename, {suffix: '.min'})
	.pipe(uglify)
	.pipe(optimizejs)
	.pipe(header, banner.min, {package: packageJson})
	.pipe(dest, paths.scripts.output);

// Repeated JavaScript tasks without babel
var jsTasks = lazypipe()
	.pipe(header, banner.full, {package: packageJson})
	.pipe(optimizejs)
	.pipe(sourcemaps.write)
	.pipe(dest, paths.scripts.output)
	.pipe(rename, {suffix: '.min'})
	.pipe(uglify)
	.pipe(optimizejs)
	.pipe(header, banner.min, {package: packageJson})
	.pipe(dest, paths.scripts.output);

// Repeated JavaScript tasks with babel
var jsTasksBabel = lazypipe()
	.pipe(babel)
	.pipe(header, banner.full, {
		package: packageJson
	})
	.pipe(optimizejs)
	.pipe(sourcemaps.write)
	.pipe(dest, paths.scripts.output)
	.pipe(rename, {
		suffix: '.min'
	})
	.pipe(uglify)
	.pipe(optimizejs)
	.pipe(header, banner.min, {
		package: packageJson
	})
	.pipe(dest, paths.scripts.output);

// Repeated JavaScript tasks without babel
var jsTasks = lazypipe()
	.pipe(header, banner.full, {
		package: packageJson
	})
	.pipe(optimizejs)
	.pipe(sourcemaps.write)
	.pipe(dest, paths.scripts.output)
	.pipe(rename, {
		suffix: '.min'
	})
	.pipe(uglify)
	.pipe(optimizejs)
	.pipe(header, banner.min, {
		package: packageJson
	})
	.pipe(dest, paths.scripts.output);

// Lint, minify, and concatenate scripts
var buildScripts = function (done) {

	// Make sure this feature is activated before running
	if (!settings.scripts) return done();

	// Run tasks on script files
	return src(paths.scripts.input)
		.pipe(flatmap(function (stream, file) {

			// If the file is a directory
			if (file.isDirectory()) {

				// Setup a suffix variable
				var suffix = '';

				// If separate polyfill files enabled
				if (settings.polyfills) {

					// Update the suffix
					suffix = '.polyfills';

					// Grab files that aren't polyfills, concatenate them, and process them
					src([file.path + '/**/*.js', '!' + file.path + '/*' + paths.scripts.polyfills])
						.pipe(sourcemaps.init())
						.pipe(concat(file.relative + '.js'))
						.pipe(jsTasksBabel());

					// for each files
					if (settings.eachJS) {
						src([file.path + '/**/*.js', '!' + file.path + '/*' + paths.scripts.polyfills])
							.pipe(jsTasksBabel());
					}
				}

				// Grab all files and concatenate them
				// If separate polyfills enabled, this will have .polyfills in the filename
				src(file.path + '/**/*.js')
					.pipe(sourcemaps.init())
					.pipe(concat(file.relative + suffix + '.js'))
					.pipe(jsTasksBabel())

				// js Vendor bundling
				src(paths.scripts.vendor)
					.pipe(sourcemaps.init())
					.pipe(concat('vendor.js'))
					.pipe(jsTasks());

				// js Vendor bundling
				// paths.scripts.vendor.push(file.path + '/**/*.js')
				if (settings.bundle) {
					src(paths.scripts.vendor)
						.pipe(sourcemaps.init())
						.pipe(src(file.path + '/**/*.js'))
						.pipe(concat('bundle.js'))
						.pipe(jsTasksBabel());
				}

				// for each files
				if (settings.eachJS) {
					src([file.path + '/**/*.js', '!' + file.path + '/*' + paths.scripts.polyfills])
						.pipe(jsTasksBabel());
				}

				return stream;

			}

			// Otherwise, process the file
			return stream.pipe(jsTasksBabel());

		}));

};
// Lint scripts
var lintScripts = function (done) {

	// Make sure this feature is activated before running
	if (!settings.scripts) return done();

	// Lint scripts
	return src(paths.scripts.input)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));

};
// Process, lint, and minify Sass files
var buildStyles = function (done) {

	// Make sure this feature is activated before running
	if (!settings.styles) return done();

	// Run tasks on all Sass files
	return src(paths.styles.input)
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle: 'expanded',
			sourceComments: true
		}))
		.pipe(prefix({
			cascade: true,
			remove: true
		}))
		.pipe(header(banner.full, { package : packageJson }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.styles.output))
		.pipe(rename({suffix: '.min'}))
		.pipe(minify({
			discardComments: {
				removeAll: true
			}
		}))
		.pipe(header(banner.min, { package : packageJson }))
		.pipe(dest(paths.styles.output));

};

// Copy static files into output folder
var copyFiles = function (done) {

	// Make sure this feature is activated before running
	if (!settings.copy) return done();

	// Copy static files
	return src(paths.copy.input)
		.pipe(dest(paths.copy.output));

};
// Watch for changes to the src directory
var startServer = function (done) {

	// Make sure this feature is activated before running
	if (!settings.reload) return done();

	// Initialize BrowserSync
	browserSync.init({
		server: {
			baseDir: paths.reload
		}
	});

	// Signal completion
	done();

};
// Reload the browser when files change
var reloadBrowser = function (done) {
	if (!settings.reload) return done();
	browserSync.reload();
	done();
};

// Watch for changes
var watchSource = function (done) {
	watch(paths.input, series(exports.default, reloadBrowser));
	done();
};
/**
 * Export Tasks
 */

// Default task
// gulp
exports.default = series(
	cleanDist,
	parallel(
		buildScripts,
		lintScripts,
		buildStyles,
		copyFiles
	)
);

// Watch and reload
// gulp watch
exports.watch = series(
	exports.default,
	startServer,
	watchSource
);
