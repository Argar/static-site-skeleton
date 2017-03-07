var gulp = require('gulp');
var sass = require('gulp-sass');
var sftp = require('gulp-sftp');
var rename = require('gulp-rename');
var i18n = require('gulp-html-i18n');
var minifyCss = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var fileinclude = require('gulp-file-include');

var sftpOptions = {
    host: 'host',
    user: 'user',
    pass: 'password',
    port: '22',
    remotePath: '/',
};

var paths = {
  sass: ['src/sass/**/*.scss'],
  html: ['src/html/**/*.html'],
};

gulp.task('default', ['sass', 'html']);

gulp.task('html', function() {
	gulp.src('src/html/*.html')
      .pipe(fileinclude({
        prefix: '@'
      }))
      .pipe(i18n({
        langDir: 'lang',
        createLangDirs: true
      }))
      .pipe(gulp.dest('dist/html'))
      .pipe(livereload());
});

gulp.task('sass', function() {
  gulp.src('src/sass/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(livereload());
});

gulp.task('deploy', function() {
  gulp.src('dist/**/*')
    .pipe(sftp(sftpOptions));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.html, ['html']);
});