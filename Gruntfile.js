var _ = require('underscore');
'use strict';

module.exports = function(grunt) {

  var appConfig = {
    appDir:  'app',
    devDir:  'dev',
    distDir: 'dist',
    filesToCopy: [
      '{,*/}*.{gif,jpeg,jpg,png,webp,gif,ico}',
      '{,*/}*.html',
      'fonts/{,*/}*.*'
    ],
    buildJS:   ['scripts/main.js', 'scripts/app.jsx'],
    buildCSS:  ['styles/main.less'],
    buildHTML: ['index.html']
  },

  prependPath      = function(file, path) { return [path, '/', file].join('') },
  prependSrc       = function(file) { return prependPath(file, appConfig.appDir) },
  prependDevBuild  = function(file) { return prependPath(file, appConfig.devDir) },
  prependDistBuild = function(file) { return prependPath(file, appConfig.distDir) },

  builtExtension   = function(file) { return file.replace(/\.less$/, '.css').replace(/\.jsx$/, '.js') },

  makeBuildSrcPathObj = function(files, buildDir) {
    // {'[built file path]': '[source file path]'}

    return _.object(files.map(function(file) {
      return [prependPath(builtExtension(file), buildDir), prependSrc(file)];
    }));
  },

  makeBuildBuildPathObj = function(files, buildDir) {
    // {'[built file path]': '[built file path]'} if already moved to 'buildDir'

    return _.object(files.map(function(file) {
      return [prependPath(builtExtension(file), buildDir), prependPath(builtExtension(file), buildDir)];
    }));
  };

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    appConfig: appConfig,

    watchify: {
      example: {
        src: '',
        dest: ''
      }
    },

    clean: {
      dev: {
        files: [{
          dot: true,
          src: ['<%= appConfig.devDir %>/*', '!<%= appConfig.devDir %>/.git*']
        }]
      },
      dist: {
        files: [{
          dot: true,
          src: ['<%= appConfig.distDir %>/*', '!<%= appConfig.distDir %>/.git*']
        }]
      }
    },

    copy: {
      dev: {
        files: [{
          expand: true,
          dot: true,
          cwd: appConfig.appDir,
          dest: appConfig.devDir,
          src: appConfig.filesToCopy
        }]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: appConfig.appDir,
          dest: appConfig.distDir,
          src: appConfig.filesToCopy
        }]
      }
    },

    browserify: {
      dev: {
        options: {
          transform: [ require('grunt-react').browserify ],
          browserifyOptions: {
            debug: true
          }
        },
        files: makeBuildSrcPathObj(appConfig.buildJS, appConfig.devDir)
      },
      dist: {
        options: {
          transform: [ require('grunt-react').browserify ],
        },
        files: makeBuildSrcPathObj(appConfig.buildJS, appConfig.distDir)
      }
    },

    less: {
      dev: {
        files: makeBuildSrcPathObj(appConfig.buildCSS, appConfig.devDir)
      },
      dist: {
        options: {
          cleancss: true
        },
        files: makeBuildSrcPathObj(appConfig.buildCSS, appConfig.distDir)
      }
    },

    htmlbuild: {
      dev: {
        src: appConfig.buildHTML.map(prependDevBuild),
        dest: '<%= appConfig.devDir %>/',
        options: {
          beautify: true,
          scripts: {
            js: appConfig.buildJS.map(prependDevBuild).map(builtExtension)
          },
          styles: {
            css: appConfig.buildCSS.map(prependDevBuild).map(builtExtension)
          }
        }
      },
      dist: {
        src: appConfig.buildHTML.map(prependDistBuild),
        dest: '<%= appConfig.distDir %>/',
        options: {
          scripts: {
            js: appConfig.buildJS.map(prependDistBuild).map(builtExtension)
          },
          styles: {
            css: appConfig.buildCSS.map(prependDistBuild).map(builtExtension)
          }
        }
      }
    },

    uglify: {
      dist: {
        files: makeBuildBuildPathObj(appConfig.buildJS, appConfig.distDir)
      }
    },

    connect: {
      options: {
        port: '1338',
        livereload: 35729
      },
      dev:  { base: appConfig.devDir },
      dist: { base: appConfig.distDir }
    },

    watch: {
      grunt: {
        files: 'Gruntfile.js',
        options: {
          livereload: true
        }
      },
      less: {
        files: '<%= appConfig.appDir %>/styles/**/*.*',
        // tasks: ['less:dev'],
        options: {
          livereload: true
        }
      },
      browserify: {
        files: '<%= appConfig.appDir %>/scripts/**/*.*',
        // tasks: ['browserify:dev'],
        options: {
          livereload: true
        }
      },
      copy: {
        files: [
          '<%= appConfig.appDir %>/{,*/}*.{gif,jpeg,jpg,png,webp,gif,ico}',
          '<%= appConfig.appDir %>/fonts/{,*/}*.*'
        ],
        // tasks: ['copy:dev'],
        options: {
          livereload: true
        }
      },
      react: {
        files: '<%= appConfig.appDir %>scripts/components/*.jsx',
        // tasks: ['browserify'],
        options: {
          livereload: true
        }
      },
      html: {
        files: '<%= appConfig.appDir %>/*.html',
        tasks: ['devBuild'],
        options: {
          livereload: true
        }
      }
    }
  // Goal:
  //
  // Task: Grunt server
  //  1: Watch the handlebars files for changes
  //  2: Watch the LESS/SASS files for changes
  //  3: Watch the JS files for changes
  //  4: Start the server
  //  5: Open the page
  //
  // Task: Grunt serve
  //  1: Same as grunt deploy but actually test the files as well
  //
  // Task: Grunt deploy
  //  1: Compile all assets
  //  2: Minify all assets
  //  3: Compile html files
  //  4: Move all required files to dist folder
  //  5: Deploy to FTP

  });

  grunt.registerTask('devBuild', [
      'clean:dev',      // clean old files out of build/dev
      'copy:dev',       // copy static asset files from app/ to build/dev
      'browserify:dev', // bundle JS with browserify
      'less:dev',       // compile LESS to CSS
      'htmlbuild:dev'   // replace tags in index.html to point to built js/css
  ]);
  grunt.registerTask('serveDev', [
      'devBuild',
      'connect:dev',     // web server for serving files from build/dev
      'watch'            // watch src files for changes and rebuild when necessary
  ]);

  // Distribution tasks
  grunt.registerTask('distBuild', [
      'clean:dist',      // clean old files out of build/dist
      'copy:dist',       // copy static asset files from app/ to build/dist
      'browserify:dist', // bundle JS with browserify
      'less:dist',       // compile LESS to CSS
      'htmlbuild:dist',  // replace tags in index.html to point to built js/css
      'uglify:dist'     // minify JS files
  ]);
  grunt.registerTask('serveDist', [
      'distBuild',
      'connect:dev',     // web server for serving files from build/dev
      'watch'            // watch src files for changes and rebuild when necessary
  ]);

  grunt.registerTask('build', ['distBuild']);
  grunt.registerTask('serve', ['serveDev']);
  grunt.registerTask('debug', ['serveDev']);
}
