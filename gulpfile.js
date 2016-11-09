var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var less = require("gulp-less");
var minify = require("gulp-clean-css");
var babel = require('gulp-babel');

var babelOptions = {
    "plugins": [
        ["transform-es2015-classes", {"loose": true}]
    ]
};

gulp.task('default', ['concat']);
gulp.task('build', ['concat', 'minify']);

gulp.task('concat', ['concat.js', 'concat.css']);

gulp.task('concat.js',  function () {
    return gulp.src('./resources/jssrc/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel(babelOptions))
        .pipe(concat('psfio.js', {newLine: '\r\n\r\n'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./resources/js/'));
});

gulp.task('concat.css',  function () {
    return gulp.src('./resources/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('psfio.css', {newLine: '\r\n\r\n'}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./resources/css/'));
});

gulp.task('minify', ['minify.js', 'minify.css']);

gulp.task('minify.js', function() {
    return gulp.src('./resources/jssrc/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel(babelOptions))
        .pipe(concat('psfio.min.js', {newLine: '\r\n\r\n'}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./resources/js/'));
});

gulp.task('minify.css', function() {
    return gulp.src('./resources/less/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('psfio.min.css', {newLine: '\r\n\r\n'}))
        .pipe(minify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./resources/css/'));
});