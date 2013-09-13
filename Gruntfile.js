module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    source: 'src',
    target: 'release',
    temp: '.tmp',
    bower: 'bower_components',

    javascript: '<%= source %>/javascript',
    actionscript: '<%= source %>/actionscript',

    clean: {
      build: '<%= target %>',
      temp: '<%= temp %>'
    },

    uglify: {
      build: {
        files: {
          '<%= temp %>/js/divine-player.min.js': [
            '<%= javascript %>/players/html5-player.js',
            '<%= javascript %>/players/flash-player.js',
            '<%= javascript %>/divine-player.js'
          ],
          '<%= temp %>/js/html5-video-shim.min.js': [
            '<%= javascript %>/html5-video-shim.js'
          ]
        }
      }
    },

    karma: {
      options: {
        frameworks: ['jasmine'],
        files: [
          '<%= bower %>/jquery/jquery.js',
          '<%= bower %>/jasmine-jquery/lib/jasmine-jquery.js',
          '<%= javascript %>/html5-video-shim.js',
          '<%= javascript %>/players/*.js',
          '<%= javascript %>/divine-player.js',
          'test/javascript/**/*.spec.js'
        ]
      },
      phantomjs: {
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },

    wrap: {
      build: {
        src: '<%= temp %>/js/divine-player.min.js',
        dest: '<%= temp %>/js/divine-player.min.js',
        options: {
          wrapper: ['var DivinePlayer = (function() {', 'return DivinePlayer;}());']
        }
      }
    },

    exec: {
      check_for_mxmlc: {
        cmd: 'mxmlc --version',
        callback: function(error) {
          if (error) {
            console.warn("Couldn't find Flex SDK on your path!");
            console.info('You can download it here: http://sourceforge.net/adobe/flexsdk/wiki/Flex%20SDK/');
          }
        }
      },
      build_swf: {
        cmd: 'mxmlc <%= actionscript %>/Player.as -o <%= temp %>/swf/divine-player.swf -use-network=false -static-link-runtime-shared-libraries=true'
      }
    },

    copy: {
      js: {
        files: [{expand: true, cwd: '<%= temp %>', src: 'js/*', dest: '<%= target %>', filter: 'isFile'}]
      },
      swf: {
        files: [{expand: true, cwd: '<%= temp %>', src: 'swf/*', dest: '<%= target %>', filter: 'isFile'}]
      }
    },

    concurrent: {
      build: {
        tasks: ['build-js', 'build-swf']
      }
    }

  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', [
    'clean:build',
    'concurrent:build',
    'clean:temp'
  ]);

  grunt.registerTask('build-js', [
    'test-js',
    'uglify:build',
    'wrap:build',
    'copy:js'
  ]);

  grunt.registerTask('build-swf', [
    'exec:check_for_mxmlc',
    'exec:build_swf',
    'copy:swf'
  ]);

  grunt.registerTask('test', [
    'test-js'
  ]);

  grunt.registerTask('test-js', [
    'karma:phantomjs'
  ]);
};
