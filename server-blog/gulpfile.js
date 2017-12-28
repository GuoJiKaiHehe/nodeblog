var gulp = require("gulp"),
	nodemon=require("nodemon"),
	less=require("gulp-less");

gulp.task('develop', function () {

  nodemon({
    script: 'app.js',
    ext: 'js coffee',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if(/^Express server listening on port/.test(chunk)){

      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task("default",['develop'])