var gulp = require('gulp');

const BUILD_DIR = './dist/';
const COVERAGE_DIR = 'coverage';

gulp.task('default', ['build']);

gulp.task('clean', ['clean-coverage', 'clean-build']);

/**
 * Empties BUILD_DIR
 */
gulp.task('clean-build', function(cb) {
	var del = require('del');
	del([BUILD_DIR + '*', COVERAGE_DIR], cb);
});

/**
 * Cleans coverage data
 */
gulp.task('clean-coverage', function(cb) {
	var del = require('del');
	del([COVERAGE_DIR], cb);
});


/**
 * Generates browser-ready version for API in BUILD_DIR
 * File will be named as api.js
 */
gulp.task('build', ['clean-build'], function() {
	var browserify = require('browserify');
	var source = require('vinyl-source-stream');
	return browserify(
			'./index.js',
			{
				standalone: 'AtTask'
			}
		)
		.ignore('promise/polyfill')
		.bundle()
		.pipe(source('attask.js'))
		.pipe(gulp.dest(BUILD_DIR));
});


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


var runMocha = function() {
	var mocha = require('gulp-mocha');
	return gulp.src('test/**/*Spec.js', {read: false})
		.pipe(mocha({}));
};

gulp.task('test', runMocha);

gulp.task('test-coverage', ['clean-coverage'], function(cb) {
	var mocha = require('gulp-mocha');
	var istanbul = require('gulp-istanbul');

	gulp.src(['src/**/*.js'])
		.pipe(istanbul()) // Covering files
		.pipe(istanbul.hookRequire()) // Force `require` to return covered files
		.on('finish', function () {
			runMocha()
			.pipe(istanbul.writeReports()) // Creating the reports after tests runned
			.on('end', cb);
		});
});

gulp.task('test-ci', ['test-coverage'], function() {
	var coveralls = require('gulp-coveralls');
	return gulp.src(COVERAGE_DIR + '/lcov.info')
		.pipe(coveralls());
});
