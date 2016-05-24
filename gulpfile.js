var gulp = require("gulp");
var uglify = require("gulp-uglify");
var cssMinify = require("gulp-minify-css");
var htmlMin = require("gulp-htmlmin");
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');
var replace = require('gulp-replace');
var del = require('del');
var pkg = require("./package.json");

var banner = ['/**',
    ' * <%= name %> - <%= description %>',
    ' * @version v<%= version %>',
    ' * @link <%= homepage %>',
    ' * @license <%= license %>',
    ' * @author <%= author.name %>',
    ' * @email <%= author.email %>',
    ' */',
    ''
].join('\r\n');

//清理
gulp.task('clear', function (cb) {
    del(['./client/pjax.js',
        './client/pjax.min.js',
        './client/pjax.css'
    ], cb);
});

//构建
gulp.task('build', ["clear"], function () {
    //js
    gulp.src([
        "./node_modules/nprogress/nprogress.js",
        "./client/jquery.ajax.progress.js",
        "./client/pjax.src.js"])
        .pipe(concat("pjax.js"))
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./client/"))
        .pipe(uglify())
        .pipe(rename("pjax.min.js"))
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./client/"))
    //css
    gulp.src("./node_modules/nprogress/nprogress.css")
        .pipe(rename("pjax.css"))
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./client/"))
        .pipe(cssMinify())
        .pipe(rename("pjax.min.css"))
        .pipe(header(banner, pkg))
        .pipe(gulp.dest("./client/"));
});

//默认任务
gulp.task('default', ["build"]);

//end