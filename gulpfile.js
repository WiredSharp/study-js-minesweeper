'use strict';
// adapted from generated on 2017-01-02 using generator-gulp-bootstrap3 0.4.4

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    include = require('gulp-include'),
    rename = require('gulp-rename'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    livereload = require('gulp-livereload'),
    gutil = require('gulp-util'),
    pathPrefix = require('gulp-path-prefix'),
    notify = require('gulp-notify');
    
    // Define paths
var paths = {  
  libs:      ['p5/lib/p5.min.js'],
  scripts:   ['./src/js/*.js'],
  styles:    ['./src/css/*.{scss,sass,css}'],
  images:    ['./src/images/**', '!./src/images/sprite/**', '!./src/images/sprite/'],
  templates: ['./src/templates/*.ejs'],
  html: ['./src/**/*.html','./src/**/*.htm']
};

// SASS
gulp.task('css', function() {
  return sass(paths.styles, {
    style: 'expanded',
    loadPath: [
      process.cwd() + '/src/css/partials',
      process.cwd() + '/src/vendor'
    ]
  })
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(gulp.dest('dist/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest('dist/css'))
  .pipe(notify({ message: 'CSS task complete' }));
});

// Javascript
gulp.task('js-libs', function() {
  return gulp.src(paths.libs.map(function(p) { return './node_modules/' + p }))
  //.pipe( pathPrefix( { prefix: './node_modules/' } ) )
  .pipe(gulp.dest('dist/js'))
});

//HTML
gulp.task('html', function() {
  return gulp.src(paths.html)
  //.pipe( pathPrefix( { prefix: './node_modules/' } ) )
  .pipe(gulp.dest('dist'))
});

gulp.task('js', ['js-libs'], function() {
  return gulp.src(paths.scripts)
    .pipe(include().on('error', gutil.log))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'JS task complete' }));
});

// Clean up
gulp.task('clean', function() {
  return del(['dist/css', 'dist/js', 'dist/fonts', 'dist/*.html']);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('js', 'html');
});


// Setup connect server
gulp.task('connect', function() {
  var connect = require('connect');
  var app = connect()
      .use(require('connect-livereload')({ port: 35729 }))
      .use(require('serve-static')('dist'))
      .use(require('serve-index')('dist'));
        
  require('http').createServer(app)
    .listen(9000)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:9000');
    });
});

// Serve
gulp.task('serve', ['connect'], function() {
  require('opn')('http://localhost:9000');
});

// Watch
gulp.task('watch', ['connect', 'serve'], function() {

  // Watch SASS files
  gulp.watch('src/css/**/*.sass', ['css']);
  
  // Watch JS files
  gulp.watch('src/js/**/*.js', ['js']);

  // Watch HTML files
  gulp.watch('src/**/*.html', ['html']);

  // Create LiveReload server
  livereload({ start: true });

  // Watch any files in assets folder reload on change
  gulp.watch(['dist/js/**', 'dist/css/**', 'dist/*.html']).on('change', function(file) {
    livereload.changed(file.path);
  });

});