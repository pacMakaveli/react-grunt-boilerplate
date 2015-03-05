'use strict';

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('app.json'),

    // Uglify the JS from dist/assets/scripts
    uglify: {
      options: {
        banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= pkg.dist_assets_path_script %>/app.js',
        dest: '<%= pkg.app_assets_path_script %>/application.min.js'
      }
    },

    // Compile the app.scss to CSS from dist/assets/styles/
    // To save bites, use vendor.scss to include all the other style related files
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= pkg.app_assets_path_style %>/application.css': '<%= pkg.dist_assets_path_style %>/app.scss'
        }
      }
    },

    // Minify the CSS compiled by SASS
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          '<%= pkg.app_assets_path_style %>/application.min.css': '<%= pkg.app_assets_path_style %>/application.css'
        }
      }
    },

    // Watch changes
    watch: {
      sass: {
        files: ['<%= pkg.dist_assets_path_style %>/app.scss'],
        tasks: ['sass']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%= pkg.app_path %>/*.html',
          '<%= pkg.app_assets_path_style %>/{,*/}/*.css',
          '<%= pkg.app_assets_path_script %>/{,*/}/*.js',
          '<%= pkg.app_assets_path_image %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },

    connect: {
      options: {
        port: 1337,
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, 'app')
            ];
          }
        }
      }
    },

    open: {
      server: {
        path: 'http://localhost:1337'
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('default', [
    'uglify',
    'sass',
    'cssmin',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);
}
