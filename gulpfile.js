var gulp = require('gulp');

var BUILD_DIR = './dist/';
var DOCS_DIR = './docs/';
var COVERAGE_DIR = 'coverage';

gulp.task('default', ['build']);

/**
 * Empties BUILD_DIR, DOCS_DIR and cleans coverage data
 */
gulp.task('clean', ['clean-coverage', 'clean-build', 'clean-docs']);

/**
 * Empties BUILD_DIR
 */
gulp.task('clean-build', function(cb) {
	var del = require('del');
	del([BUILD_DIR + '*'], cb);
});

/**
 * Cleans coverage data
 */
gulp.task('clean-coverage', function(cb) {
	var del = require('del');
	del([COVERAGE_DIR], cb);
});

/**
 * Empties DOCS_DIR
 */
gulp.task('clean-docs', function(cb) {
	var del = require('del');
	del([DOCS_DIR + '*'], cb);
});


/**
 * Generates browser-ready version for API in BUILD_DIR
 * File will be named as attask.js, minified version will be attask.min.js
 */
gulp.task('build', ['clean-build'], function() {
	var browserify = require('browserify');
	var source = require('vinyl-source-stream');
	var buffer = require('vinyl-buffer');
	var uglify = require('gulp-uglify');
	var rename = require('gulp-rename');
	return browserify(
			'./index.js',
			{
				standalone: 'AtTask'
			}
		)
		.ignore('promise/polyfill')
		.bundle()
		.pipe(source('attask.js'))
		.pipe(buffer())
		.pipe(gulp.dest(BUILD_DIR))
		.pipe(rename({ extname: '.min.js' }))
		.pipe(uglify())
		.pipe(gulp.dest(BUILD_DIR));
});

/**
 * Generate documentation in ./docs/ directory
 */
gulp.task('docs', ['clean-docs'], function() {
	var jsdoc = require("gulp-jsdoc");
	return gulp.src(["src/**/*.js", "README.md"])
		.pipe(
			jsdoc(DOCS_DIR, {
				path: 'ink-docstrap',
				systemName: 'attask-api',
				//footer: "Something",
				//copyright: "Something",
				navType: "vertical",
				theme: "united",
				linenums: true,
				collapseSymbols: false,
				inverseNav: false
			})
		);
});

/**
 * Opens web server in a project directory
 */
gulp.task('serve', function() {
	var webserver = require('gulp-webserver');
	gulp.src('./')
		.pipe(webserver({
			hostname: 'localhost',
			port: 8000,
			livereload: true,
			directoryListing: true,
			open: true
		}));
});


var runTests = function() {
	var mocha = require('gulp-mocha');
	return gulp.src('test/**/*.spec.js', {read: false})
		.pipe(mocha({}));
};

/**
 * Runs all tests
 */
gulp.task('test', runTests);

/**
 * Runs all tests with coverage
 */
gulp.task('test-coverage', ['clean-coverage'], function(cb) {
	var istanbul = require('gulp-istanbul');

	gulp.src(['src/**/*.js'])
		.pipe(istanbul()) // Covering files
		.pipe(istanbul.hookRequire()) // Force `require` to return covered files
		.on('finish', function () {
			runTests()
			.pipe(istanbul.writeReports()) // Creating the reports after tests runned
			.on('end', cb);
		});
});

/**
 * This intended to be run only on Travis CI.
 * Runs all tests with coverage, when upload coverage data to coveralls.io
 */
gulp.task('test-ci', ['test-coverage'], function() {
	var coveralls = require('gulp-coveralls');
	return gulp.src(COVERAGE_DIR + '/lcov.info')
		.pipe(coveralls());
});
