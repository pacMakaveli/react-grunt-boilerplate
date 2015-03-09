var _ = require('underscore');
'use strict';

module.exports = function(grunt) {

  var appConfig = {
    uri: 'localhost',
    port: '1338',
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

  makeBuildSourceObj = function(files, buildDir) {
    // {'[built file path]': '[source file path]'}

    return _.object(files.map(function(file) {
      return [prependPath(builtExtension(file), buildDir), prependSrc(file)];
    }));
  },

  makeBuildObj = function(files, buildDir) {
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
      options: {
        dot: true
      },
      dev: {
        src: ['<%= appConfig.devDir %>/*', '!<%= appConfig.devDir %>/.git*']
      },
      dist: {
        src: ['<%= appConfig.distDir %>/*', '!<%= appConfig.distDir %>/.git*']
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
      options: {
        transform: [
          require('grunt-react').browserify
        ]
      },
      dev: {
        options: {
          browserifyOptions: {
            debug: true
          }
        },
        files: makeBuildSourceObj(appConfig.buildJS, appConfig.devDir)
      },
      dist: {
        files: makeBuildSourceObj(appConfig.buildJS, appConfig.distDir)
      }
    },

    less: {
      dev: {
        files: makeBuildSourceObj(appConfig.buildCSS, appConfig.devDir)
      },
      dist: {
        options: {
          cleancss: true
        },
        files: makeBuildSourceObj(appConfig.buildCSS, appConfig.distDir)
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
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: makeBuildObj(appConfig.buildJS, appConfig.distDir)
      }
    },

    connect: {
      options: {
        port: appConfig.port,
        livereload: 35729
      },
      dev:  {
        options: {
          base: appConfig.devDir
        }
      },
      dist: {
        options: {
          base: appConfig.distDir
        }
      }
    },

    open: {
      server: {
        path: 'http://<%= appConfig.uri %>:<%= appConfig.port %>'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      grunt: {
        files: 'Gruntfile.js'
      },
      less: {
        files: '<%= appConfig.appDir %>/styles/**/*.*',
        tasks: ['less:dev']
      },
      browserify: {
        files: '<%= appConfig.appDir %>/scripts/**/*.*',
        tasks: ['browserify:dev']
      },
      copy: {
        files: [
          '<%= appConfig.appDir %>/{,*/}*.{gif,jpeg,jpg,png,webp,gif,ico}',
          '<%= appConfig.appDir %>/fonts/{,*/}*.*'
        ],
        tasks: ['copy:dev']
      },
      react: {
        files: '<%= appConfig.appDir %>scripts/components/*.jsx',
        tasks: ['browserify']
      },
      html: {
        files: '<%= appConfig.appDir %>/*.html',
        tasks: ['buildDev']
      }
    }
  });

  grunt.registerTask('buildDev', [
    'clean:dev',
    'copy:dev',
    'browserify:dev',
    'less:dev',
    'htmlbuild:dev'
  ]);

  grunt.registerTask('serveDev', [
    'buildDev',
    'connect:dev',
    'open',
    'watch'
  ]);

  grunt.registerTask('buildDist', [
    'clean:dist',
    'copy:dist',
    'browserify:dist',
    'less:dist',
    'htmlbuild:dist',
    'uglify:dist'
  ]);

  grunt.registerTask('serveDist', [
    'buildDist',
    'connect:dev',
    'open',
    'watch'
  ]);

  grunt.registerTask('default', ['serveDev']);
  grunt.registerTask('debug', ['serveDist']);
  grunt.registerTask('deploy', ['buildDist']);
}
