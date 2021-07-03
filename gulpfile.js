/**
 * Gulp Settings
 * Created by Alexey S. Kiselev.
 */

let gulp = require('gulp'),
    replace = require('gulp-replace-path'),
    babel = require('gulp-babel');

// Bundle main Index File
gulp.task('build:node', function(done) {
    gulp.src([
        './index.js',
        './core/**/*.js'
    ]).
        on('error', function(e){
            console.error('Error occurred during build: ' + e);
            this.emit('end');
        }).
        pipe(babel({
            presets: ['@babel/preset-env', '@babel/preset-flow'],
            plugins: [
                [
                    '@babel/plugin-proposal-decorators',
                    {
                        'legacy': true
                    }
                ]
            ]
        })).
        on('error', function(e){
            console.error('Error occurred during build: ' + e);
            this.emit('end');
        }).
        pipe(replace(/(\/core)/g,'')).
        on('error', function(e){
            console.error('Error occurred during build: ' + e);
            this.emit('end');
        }).
        pipe(gulp.dest('./lib/')).
        on('error', function(e){
            console.error('Error occurred during build: ' + e);
            this.emit('end');
        });
    done();
});

// Default task
gulp.task('default', gulp.series('build:node'));
