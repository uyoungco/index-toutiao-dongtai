var path = require('path')
var gulp = require('gulp')
var babel = require('gulp-babel')
var less = require('gulp-less')
var notify = require('gulp-notify') // 报错处理
var cleancss = require('gulp-clean-css') // 代码压缩
var rename = require('gulp-rename') // 文件重命名
var del = require('del'); // 删除文件
var imagemin = require('gulp-imagemin') // 图片压缩
// var jshint = require('gulp-jshint') // js代码检查
// es6转es5
var uglify = require('gulp-uglify') // js代码压缩
var livereload = require('gulp-livereload')
var plumber = require('gulp-plumber')
var connect = require('gulp-connect')  // 服务器
var ts = require('gulp-typescript'); // typeScript编译


var LessAutoprefix = require('less-plugin-autoprefix')
var autoprefix = new LessAutoprefix({
  browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
});



// 编译less、自动添加css前缀和压缩
gulp.task('styles', function () {
  return gulp.src('app/less/*.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')],
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(cleancss())
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(connect.reload());
});

notify.onError({
  title: 'Gulp',
  subtitle: 'Failure!',
  message: 'Error: <%= error.message %>',
  sound: 'Beep'
});

// js代码校验、合并和压缩
gulp.task('scripts', function () {
  return gulp.src('app/js/*.js')
    .pipe(plumber()) //加入plumber
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(connect.reload())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/assets/js'));
});

    // .pipe(rename({
    //   suffix: '.min'
    // }))
    // .pipe(uglify())
    // .pipe(gulp.dest('dist/assets/js'))
    // .pipe(notify({
    //   message: 'Scripts task complete'
    // }));


//  typescript
var tsProject = ts.createProject('tsconfig.json'); 
gulp.task('typescript', function () {
  var tsResult = gulp.src('app/js/*.ts').pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist/assets/js')).pipe(connect.reload());
});



// 压缩图片
gulp.task('images', function () {
  return gulp.src('app/images/*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src('app/*.html')
  .pipe(gulp.dest('dist/'))
  .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 8000,
    livereload: true
  });
});


// 清除文件
gulp.task('clean', function (cb) {
  del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb)
});


// 设置默认任务（default）
// gulp.task('default', ['connect','clean'], function () {
//   gulp.start('styles');
// });

gulp.task('default', ['connect','watch'], function () {
  gulp.start('styles');
});


// Watch
gulp.task('watch', function () {
  // Watch .html files
  gulp.watch('app/*.html', ['html']);
  // Watch .scss files
  gulp.watch('app/less/*.less', ['styles']);
  // Watch .js files
  gulp.watch('app/js/*.js', ['scripts']);
  // Watch .ts files
  gulp.watch('app/js/*.ts', ['typescript']);
  // Watch image files
  gulp.watch('app/images/*', ['images']);
  // Create LiveReload server
  livereload.listen();
  // Watch any files in dist/, reload on change
  gulp.watch(['dist/**']).on('change', livereload.changed);
});