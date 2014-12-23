var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var del = require('del');
var mocha = require('gulp-mocha');
var webserver = require('gulp-webserver');

const BUILD_DIR = './dist/';


gulp.task('default', ['clean', 'build']);

/**
 * Empties BUILD_DIR
 */
gulp.task('clean', function(cb) {
	del([BUILD_DIR + '*'], cb);
});

/**
 * Generates browser-ready version for API in BUILD_DIR
 * File will be named as api.js
 */
gulp.task('build', function() {
	return browserify('./src/api.js')
		.bundle()
		.pipe(source('api.js'))
		.pipe(gulp.dest(BUILD_DIR));
});


gulp.task('serve', function() {
	gulp.src('./')
		.pipe(webserver({
			hostname: 'localhost',
			port: 8000,
			livereload: true,
			directoryListing: true,
			open: true
		}));
});


gulp.task('test', function() {
	return gulp.src('test/**/*Spec.js', {read: false})
		.pipe(mocha({}));
});
