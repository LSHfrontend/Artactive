"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var imageminPngquant = require('imagemin-pngquant');
var imageminMozjpeg = require('imagemin-mozjpeg');
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify-es").default;

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("normalize", function () {
  return gulp.src("source/css/normalize.css")
    .pipe(minify())
    .pipe(rename("normalize.min.css"))
    .pipe(gulp.dest("build/css"))
});

gulp.task("image-optim", function () {
  return gulp.src("source/img/*.{png,jpg,svg}")
  .pipe(imagemin([
    imageminPngquant({quality: 75}),
    imageminMozjpeg({quality: 75, progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/*.{png,jpg}")
  .pipe(webp({quality: 75}))
  .pipe(gulp.dest("source/img"));
});

gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
  .pipe(svgstore({inlineSvg: true}))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("source/img"));
});

gulp.task("html", function () {
  return gulp.src("source/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
 });

 gulp.task("js", function () {
  return gulp.src("source/js/*.js")
  .pipe(plumber())
  .pipe(uglify())
  .pipe(gulp.dest("build/js"))
  .pipe(server.stream());
 });

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html", gulp.series("html")).on("change", server.reload);
  gulp.watch("source/**/*.js", gulp.series("js"));
});

gulp.task("copy", function () {
  return gulp.src([
  "source/fonts/**/*.{woff,woff2}",
  "!source/img/originals",
  "!source/img/originals/**",
  "source/img/**.{jpg,png,svg,webp}",
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
 });

 gulp.task("clean", function () {
  return del(["build/**", "!build"]);
 });

gulp.task("build", gulp.series("clean", "copy", "css", "normalize", "html", "js"));

gulp.task("images", gulp.series("image-optim", "webp", "sprite"));
