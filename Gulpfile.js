var gulp     = require('gulp');
var jshint   = require('gulp-jshint');
var jscs   = require('gulp-jscs');
var Server   = require('karma').Server;

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

gulp.task('ci', ['lint', 'jscs']);