/**
 * Gulp Settings
 * Created by Alexey S. Kiselev on 08.09.2017.
 */

let gulp = require('gulp'),
    replace = require('gulp-replace-path'),
    babel = require('gulp-babel');

// Bundle main Index File
gulp.task('build:node', async function() {
    gulp.src([
        './index.js',
        './core/**/*.js'
    ]).
        on('error', function(){
            console.error('Error occurred during build');
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
        pipe(replace(/(\/core)/g,'')).
        pipe(gulp.dest('./lib/'));
});

// Default task
gulp.task('default', gulp.series('build:node'));