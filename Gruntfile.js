module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    source: 'src',
    release: 'release',
    fixtures: 'test/fixtures',
    bower: 'bower_components',
    temp: '.tmp',

    javascript: '<%= source %>/javascript',
    actionscript: '<%= source %>/actionscript',

    clean: {
      build: '<%= release %>',
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
        singleRun: true,
        files: [
          // Code under test
          '<%= javascript %>/html5-video-shim.js',
          '<%= javascript %>/players/*.js',
          '<%= javascript %>/divine-player.js',

          // Test libraries
          '<%= bower %>/jquery/jquery.js',
          '<%= bower %>/jasmine-jquery/lib/jasmine-jquery.js',

          // Behaviour specifications
          'test/javascript/**/*.spec.js',

          // Fixtures for use in tests cases
          {pattern: '<%= fixtures %>/*', included: false, served: true},

          // Needed for testing Flash player
          {pattern: '<%= release %>/swf/divine-player.swf', included: false, served: true}
        ]
      },
      phantomjs: {
        browsers: ['PhantomJS']
      },
      browser: {
        browsers: ['Chrome', 'Firefox']
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
        files: [{expand: true, cwd: '<%= temp %>', src: 'js/*', dest: '<%= release %>', filter: 'isFile'}]
      },
      swf: {
        files: [{expand: true, cwd: '<%= temp %>', src: 'swf/*', dest: '<%= release %>', filter: 'isFile'}]
      }
    },

    concurrent: {
      build: {
        tasks: ['build:js', 'build:swf']
      }
    }

  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('build', [
    'clean:build',
    'concurrent:build',
    'clean:temp'
  ]);

  grunt.registerTask('build:js', [
    'test:headless',
    'uglify:build',
    'wrap:build',
    'copy:js'
  ]);

  grunt.registerTask('build:swf', [
    'exec:check_for_mxmlc',
    'exec:build_swf',
    'copy:swf'
  ]);

  grunt.registerTask('test', [
    'test:headless'
  ]);

  grunt.registerTask('test:headless', [
    'karma:phantomjs'
  ]);

  grunt.registerTask('test:browser', [
    'karma:browser'
  ]);
};
