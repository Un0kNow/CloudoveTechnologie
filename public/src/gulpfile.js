// Load plugins
const browsersync = require("browser-sync").create();
const gulp = require("gulp");

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function(cb) {

  // Bootstrap
  gulp.src([
      './node_modules/bootstrap/photoswipe/**/*',
      '!./node_modules/bootstrap/photoswipe/css/bootstrap-grid*',
      '!./node_modules/bootstrap/photoswipe/css/bootstrap-reboot*'
    ])
    .pipe(gulp.dest('./vendor/bootstrap'))

  // jQuery
  gulp.src([
      './node_modules/jquery/photoswipe/*',
      '!./node_modules/jquery/photoswipe/core.js'
    ])
    .pipe(gulp.dest('./vendor/jquery'))

  // jQuery Easing
  gulp.src([
      'node_modules/jquery.easing/*.js'
    ])
    .pipe(gulp.dest('vendor/jquery-easing'))

  cb();

});

// BrowserSync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./"
    }
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

// Watch files
function watchFiles() {
  gulp.watch("./css/*", browserSyncReload);
  gulp.watch("./**/*.html", browserSyncReload);
}

gulp.task("default", gulp.parallel('vendor'));

// dev task
gulp.task("dev", gulp.parallel(watchFiles, browserSync));
