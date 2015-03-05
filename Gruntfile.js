module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('app.json'),
    uglify: {
      options: {
        banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= pkg.dist_assets_path_script %>/app.js',
        dest: '<%= pkg.app_assets_path_script %>/application.min.js'
      }
    },

    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          '<%= pkg.app_assets_path_style %>/application.min.css': '<%= pkg.dist_assets_path_style %>/app.scss'
        }
      }
    }
  });

  grunt.registerTask('default', [
    'uglify',
    'sass'
  ]);
}
