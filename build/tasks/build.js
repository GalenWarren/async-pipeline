const gulp = require("gulp");
const babel = require("gulp-babel");
const plumber = require("gulp-plumber")
const sourceMaps = require("gulp-sourcemaps")
const changed = require("gulp-changed");
const notify = require("gulp-notify");
const config = require("../config")

gulp.task("build", ["clean"], () => {
	return gulp.src( config.paths.src )
		.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
		.pipe(changed( config.paths.distRoot ))
    .pipe(sourceMaps.init())
		.pipe(babel())
    .pipe(sourceMaps.write("."))
		.pipe(gulp.dest(config.paths.distRoot));
});
