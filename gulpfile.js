const { src, dest, watch, series } = require("gulp");
const pug = require("gulp-pug");
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const { server, startPath } = require("browser-sync/dist/default-config");
const browsersync = require("browser-sync").create();

//html task
function htmlTask() {
	return src("stage/html/*.pug")
		.pipe(pug({ pretty: true }))
		.pipe(dest("./dist"))
		.pipe(browsersync.stream());
}

//sass task
function cssTask() {
	return src("stage/css/**/*.scss", { sourcemaps: true })
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss([cssnano()]))
		.pipe(dest("./dist/css", { sourcemaps: "." }))
		.pipe(browsersync.stream());
}

//js task
function jsTask() {
	return src("stage/js/*.js", { sourcemaps: true })
		.pipe(terser())
		.pipe(dest("./dist/js"), { sourcemaps: "." })
		.pipe(browsersync.stream());
}

//browsersync task
function browsersyncServer(cb) {
	browsersync.init({
		server: {
			baseDir: "."
		},
		startPath: "dist/Home.html"
	});
	cb();
}

function browsersyncReload(cb) {
	browsersync.reload();
	cb();
}

//watch task
function watchTask() {
	watch(
		["stage/html/**/*.pug", "stage/css/**/*.scss", "stage/js/*.js"],
		series(htmlTask, cssTask, jsTask, browsersyncReload)
	);
}

//default gulp task
exports.default = series(htmlTask, cssTask, jsTask, browsersyncServer, watchTask);
