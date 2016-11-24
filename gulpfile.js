var gulp = require('gulp'),
	less = require('gulp-less'),
	include = require("gulp-include"),
	install = require("gulp-install"),
	gp_concat = require('gulp-concat'),
	gp_rename = require('gulp-rename'),
	gp_uglify = require('gulp-uglify'),
	gp_sourcemaps = require('gulp-sourcemaps');

var spawn = require('child_process').spawn;
var path = require('path');

var node;

var dirs = {
	clientbuild: "./build",
	clientsrc: "./src",
};


/*High level tasks*/
gulp.task('build', ['client']);

//automagically re-build and run
gulp.task('develop', function() {
	gulp.start(['build','run']);
	gulp.watch(dirs.clientsrc + '/**/*', ['client']);
});

//run node, if it's already running
gulp.task('run', function() {
	if (node) node.kill();
	node = spawn('node', ['node_modules/http-server/bin/http-server','build','-p 80'], {stdio: 'inherit'});
	node.on('close', function (code) {
		if (code === 8) {
			gulp.log('Error detected, waiting for changes...');
		}
	});
});

//kill node on exit
process.on('exit', function() {
	if (node) node.kill();
});

/*Build server*/
gulp.task('server', ['copy_server' ,'install_npm']);

gulp.task('copy_server',function(){
	return gulp.src(dirs.serversrc+'/**/*')
		.pipe(gulp.dest(dirs.serverbuild+'/'));
});

gulp.task('install_npm',function(){
	return gulp.src([dirs.serverbuild+'/package.json'])
		.pipe(install());
});

/* Build client */
gulp.task('client', ['js', 'less', 'html', 'img']);

gulp.task('js', function(){
  return gulp.src([
      dirs.clientsrc+'/js/open311.js',
      dirs.clientsrc+'/js/modal.js',
      dirs.clientsrc+'/js/form/*.js',
      dirs.clientsrc+'/js/overview/*.js'
    ])
    //.pipe(gp_sourcemaps.init())
    .pipe(gp_concat('open311.js'))
    .pipe(gulp.dest(dirs.clientbuild+'/js'))
    .pipe(gp_rename('open311.min.js'))
    .pipe(gp_uglify())
    .pipe(gp_sourcemaps.write('./'))
    .pipe(gulp.dest(dirs.clientbuild+'/js'));
});

//compile Less files to Css
gulp.task('less', function () {
    return gulp.src(dirs.clientsrc + '/style/style.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        .pipe(gulp.dest(dirs.clientbuild+'/style'));
});

//simply copy html and static files
gulp.task('html', function(){
    return gulp.src(dirs.clientsrc+'/*.html')
        .pipe(gulp.dest(dirs.clientbuild+'/'));
});

gulp.task('img', function(){
    return gulp.src(dirs.clientsrc + '/img/*')
        .pipe(gulp.dest(dirs.clientbuild + '/img'));
});
