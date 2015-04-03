'use strict';

//npm install gulp gulp-minify-css gulp-uglify gulp-clean gulp-cleanhtml gulp-jshint gulp-strip-debug gulp-zip --save-dev

//npm uninstall gulp-minify-css gulp-strip-debug vinyl-buffer gulp-cleancss rework-plugin-inline path gulp-autoprefixer gulp-rework glob --save-dev

var gulp = require('gulp');
var clean = require('gulp-clean');
var cleanhtml = require('gulp-cleanhtml');

var jshint = require('gulp-jshint');

var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

var browserify = require('browserify');

var concat = require('gulp-concat');
var gulp = require('gulp');
var gulpif = require('gulp-if');

var jshint = require('gulp-jshint');

var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var literalify = require('literalify');
var watchify = require('watchify');
var reactify = require('reactify');
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var streamify = require('gulp-streamify');
var notify = require('gulp-notify');

var minifyCSS = require('gulp-minify-css');

var react = require('gulp-react');

// External dependencies you do not want to rebundle while developing,
// but include in your application deployment
var dependencies = [];

// Bower External dependencies
// map module names with global objects
var bowerDependencies = {
    'react': 'window.React',
    'jquery': 'window.$'
};


//-----------------------------------------
// browserify


var browserifyTask = function (options) {

    // Our app bundler
    var appBundler = browserify({
        entries: [options.src], // Only need initial file, browserify finds the rest
        transform: [reactify], // We want to convert JSX to normal javascript
        debug: options.development, // Gives us sourcemapping
        cache: {},
        packageCache: {},
        fullPaths: options.development // Requirement of watchify
    }).transform(literalify.configure(bowerDependencies));

    // We set our dependencies as externals on our app bundler when developing
    (options.development ? dependencies : []).forEach(function (dep) {
        appBundler.external(dep);
    });

    // The rebundle process
    var rebundle = function () {
        var start = Date.now();
        console.log('Building APP bundle');
        appBundler.bundle()
            .on('error', gutil.log)
            .pipe(source(options.bundleName || 'bundle.js'))
            .pipe(gulpif(!options.development, streamify(uglify())))
            .pipe(gulp.dest(options.dest))
            .pipe(gulpif(options.development, livereload()))
            .pipe(notify(function () {
                console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
            }));
    };

    // Fire up Watchify when developing
    if (options.development) {
        appBundler = watchify(appBundler);
        appBundler.on('update', rebundle);
    }

    rebundle();

    // We create a separate bundle for our dependencies as they
    // should not rebundle on file changes. This only happens when
    // we develop. When deploying the dependencies will be included
    // in the application bundle
    if (options.development) {

        //var testFiles = glob.sync('./specs/**/*-spec.js');
        //var testBundler = browserify({
        //    entries: testFiles,
        //    debug: true, // Gives us sourcemapping
        //    transform: [reactify],
        //    cache: {}, packageCache: {}, fullPaths: true // Requirement of watchify
        //});
        //
        //dependencies.forEach(function (dep) {
        //    testBundler.external(dep);
        //});
        //
        //var rebundleTests = function () {
        //    var start = Date.now();
        //    console.log('Building TEST bundle');
        //    testBundler.bundle()
        //        .on('error', gutil.log)
        //        .pipe(source('specs.js'))
        //        .pipe(gulp.dest(options.dest))
        //        .pipe(livereload())
        //        .pipe(notify(function () {
        //            console.log('TEST bundle built in ' + (Date.now() - start) + 'ms');
        //        }));
        //};
        //
        //testBundler = watchify(testBundler);
        //testBundler.on('update', rebundleTests);
        //rebundleTests();

        // Remove react-addons when deploying, as it is only for
        // testing
        if (!options.development) {
            dependencies.splice(dependencies.indexOf('react-addons'), 1);
        }

        // Run the vendor bundle
        var start = new Date();
        console.log('Building VENDORS bundle');
        gulp.src(options.vendersSrc || [])
            .pipe(concat(options.vendersName || 'vendors.js'))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./app/javascript'))
            .pipe(notify(function () {
                console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
            }));

    }

};


var cssTask = function (options) {
    if (options.development) {
        var run = function () {
            console.log(arguments);
            var start = new Date();
            console.log('Building CSS bundle');
            gulp.src(options.src)
                .pipe(concat(options.bundleName || 'main.css'))
                .pipe(gulp.dest(options.dest))
                .pipe(gulpif(options.development, livereload()))
                .pipe(notify(function () {
                    console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
                }));
        };
        run();
        gulp.watch(options.src, run);
    } else {
        gulp.src(options.src)
            .pipe(concat(options.bundleName || 'main.css'))
            .pipe(minifyCSS())
            .pipe(gulp.dest(options.dest));
    }
};

var htmlTask = function (options) {
    var run = function () {
        gulp.src(options.src)
            .pipe(livereload());
    };
    gulp.watch(options.src, run);
};

//-----------------------------------------
// chrome extension
//clean build directory
gulp.task('clean', function () {
    return gulp.src('dist/*', {
        read: false
    })
        .pipe(clean());
});

//copy static folders to build directory
gulp.task('copy', function () {
    gulp.src('app/fonts/**')
        .pipe(gulp.dest('dist/fonts'));
    gulp.src('app/icons/**')
        .pipe(gulp.dest('dist/icons'));
    gulp.src('app/_locales/**')
        .pipe(gulp.dest('dist/_locales'));
    gulp.src('app/images/**')
        .pipe(gulp.dest('dist/images'));
    return gulp.src('app/manifest.json')
        .pipe(gulp.dest('dist'));
});

//copy and compress HTML files
gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe(cleanhtml())
        .pipe(gulp.dest('dist'));
});

//run scripts through JSHint
gulp.task('jshint', function () {
    return gulp.src([
        './gulpfile.js',
        'assets/javascript/**/*.js',
        '!assets/javascript/analytics.js'
    ])
        .pipe(react())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

//copy vendor scripts and uglify all other scripts, creating source maps
gulp.task('scripts', ['jshint'], function () {
    return gulp.src('app/javascript/*.js')
        .pipe(gulp.dest('dist/javascript'));
});

//minify styles
gulp.task('styles', function () {
    return gulp.src('app/styles/**')
        .pipe(gulp.dest('dist/styles'));
});

//build ditributable and sourcemaps after other tasks completed
gulp.task('zip', ['html', 'scripts', 'styles', 'copy'], function () {
    var manifest = require('./dist/manifest'),
        distFileName = manifest.name + ' v' + manifest.version + '.zip';
    console.log('distFileName= ' + distFileName);
    return gulp.src(['dist/**/*'])
        .pipe(zip(distFileName))
        .pipe(gulp.dest('package'));
});

//run all tasks after build directory has been cleaned
gulp.task('default', ['clean'], function () {

    var isDevelopment = false;

    // option.js
    browserifyTask({
        development: isDevelopment,
        src: './assets/javascript/option/option.js',
        dest: './app/javascript/',
        bundleName: 'optionBundle.js',
        vendersSrc: [
            './bower_components/jquery/dist/jquery.js',
            './bower_components/semantic/dist/components/checkbox.min.js',
            './bower_components/react/react.js'
        ],
        vendersName: 'optionVendors.js'
    });

    // popup.js
    browserifyTask({
        development: isDevelopment,
        src: './assets/javascript/popup/popup.js',
        dest: './app/javascript/',
        bundleName: 'popupBundle.js',
        vendersSrc: [
            './bower_components/react/react.js'
        ],
        vendersName: 'popupVendors.js'
    });

    // background.js
    browserifyTask({
        development: isDevelopment,
        src: './assets/javascript/background.js',
        dest: './app/javascript/',
        bundleName: 'background.js'
    });

    // option.html
    cssTask({
        development: isDevelopment,
        src: [
            './bower_components/semantic/dist/semantic.css',
            './assets/stylesheet/doc.css'
        ],
        dest: './app/styles',
        bundleName: 'option.css'
    });

    // popup.html
    cssTask({
        development: isDevelopment,
        src: [
            './bower_components/semantic/dist/semantic.css',
            './assets/stylesheet/custom.css'
        ],
        dest: './app/styles',
        bundleName: 'popup.css'
    });

    htmlTask({
        development: isDevelopment,
        src: './app/**/*'
    });
});
