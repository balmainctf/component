'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cssmin = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const connect = require('gulp-connect');

const dirs = {
	script: 'script',
	style: 'style',
	dist: 'dist',
};

const distPath = {
	script: `${dirs.script}/` + '*.js',
	style: `${dirs.style}/` + '*.css',
  dist: `${dirs.dist}`,
};

gulp.task('babel', () => {
	return gulp.src(distPath.script)
			.pipe(babel({
					presets: ['es2015']
				}))
			.pipe(rename({suffix: '.min'}))
			.pipe(uglify())
			.pipe(gulp.dest(distPath.dist));
});

gulp.task('cssmin', () => {
	return gulp.src(distPath.style)
			.pipe(rename({suffix: '.min'}))
			.pipe(cssmin())
			.pipe(gulp.dest(distPath.dist));
});

gulp.task('watch', () => {
	gulp.watch(distPath.script, [babel]);
	gulp.watch(distPath.style, [cssmin]);
});

gulp.task('connect', function () {
  connect.server({
    root: '.',
		port: 8888,
    livereload: true
  });
});

gulp.task('default', ['babel', 'cssmin', 'connect', 'watch']);
