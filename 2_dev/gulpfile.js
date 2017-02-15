var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    critical = require('critical'),
    useref = require('gulp-useref'),
    gulpIf = require('gulp-if'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    tinypng = require('gulp-tinypng'),
    // cache = require('gulp-cache'),
    // imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    runSequence = require('run-sequence');


// development
// ------------------------------
// ------------------------------

gulp.task('html', function() {
  return gulp.src('app/**/*.html')
    .pipe(browserSync.stream());
});

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'expanded'
        }).on('error', errorHandler))
      .pipe(autoprefixer({
        browsers: ['> 1%']
        }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

function errorHandler(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('js', function() {
  return gulp.src('app/js/**/*.js')
    .pipe(browserSync.stream());
});

// gulp.task('image', function() {
//   return gulp.src('app/images/**/*')
//     .pipe(browserSync.stream());
// });

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
    // address http://[...].localtunnel.me
    // tunnel: "noito",
    browser: 'google chrome'
  });
});

// start dev
gulp.task('default', ['browserSync', 'sass'], function(){
  gulp.watch('app/*.html', ['html']);
  gulp.watch('app/scss/*.scss', ['sass']);
  gulp.watch('app/js/*.js', ['js']);
  // gulp.watch('app/images/**/*', ['image']);
});



// distribution
// ------------------------------
// ------------------------------

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('sass-dist', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({browsers: ['> 1%']}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('js-dist', function() {
  return gulp.src('app/**/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist/'));
});

gulp.task('image-dist', function() {
  return gulp.src('app/images/**/*.+(png|jpg|gif)')
    .pipe(tinypng('SxoUBt9YN3VLyVzjuiSe7QwW4I4W-lZe'))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('copyJSON', function() {
  return gulp.src('app/*.json')
    .pipe(gulp.dest('dist/'));
});

gulp.task('critical', function (cb) {
    critical.generate({
        inline: true,
        base: 'dist/',
        src: 'index.html',
        dest: 'dist_crit/index.html',
        minify: true,
        width: 1280,
        height: 800
    });
});

// start dist
gulp.task('dist', function (callback) {
  runSequence('clean:dist',
    ['sass-dist', 'js-dist', 'copyJSON'],
    callback
  );
});
