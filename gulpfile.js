/**
 * Gulp Settings
 * Created by Alexey S. Kiselev on 08.09.2017.
 */

let gulp = require('gulp'),
    replace = require('gulp-replace-path'),
    babel = require('gulp-babel');

// Bundle main Index File
gulp.task('build:node',function(){
    gulp.src([
        './index.js',
        './core/**/*.js'
    ]).
        on('error', function(){
            console.error('Error');
            this.emit('end');
        }).
        pipe(babel({
            presets: ['es2015', 'flow']
        })).
        pipe(replace(/(\/core)/g,'')).
        pipe(gulp.dest('./lib/'));
});

// Default task
gulp.task('default', ['build:node']);