var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function(){
  return del(['client/app/**/*.map', 'client/app/**/*.js', 'client/app/**/*.d.ts', 'client/app/.DS_Store', 'client/.DS_Store']);
})

gulp.task('default', ['clean'])
