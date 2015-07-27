var gulp     = require('gulp');
var connect  = require('gulp-connect');
var jshint   = require('gulp-jshint');
var jscs     = require('gulp-jscs');
var Server   = require('karma').Server;
var less     = require('gulp-less');
var path     = require('path');

gulp.task('less', function () {
  return gulp.src('./src/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('jscs', function () {
  return gulp.src('src/**/*.js')
    .pipe(jscs());
});

gulp.task('connect', function() {
  connect.server();
});

gulp.task('ci', ['lint', 'jscs']);
