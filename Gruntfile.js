module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    source: 'src',
    release: 'release',
    test: 'test',
    fixtures: '<%= test %>/fixtures',
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
        browserDisconnectTimeout: 5000,
        files: [
          // Code under test
          '<%= javascript %>/html5-video-shim.js',
          '<%= javascript %>/players/*.js',
          '<%= javascript %>/divine-player.js',

          // Test libraries
          '<%= bower %>/jquery/jquery.js',
          '<%= bower %>/jasmine-jquery/lib/jasmine-jquery.js',
          '<%= test %>/jasmine-cit.js',
          '<%= test %>/jasmine-helpers.js',

          // Behaviour specifications
          'test/javascript/**/*.spec.js',

          // Fixtures for use in tests cases
          {pattern: '<%= fixtures %>/*', included: false, served: true},

          // Needed for testing Flash player
          {pattern: '<%= release %>/swf/divine-player.swf', included: false, served: true}
        ],

        sauceLabs: {
          startConnect: false,
          testName: '<%= pkg.name %> v<%= pkg.version %>'
        },

        // For more SauceLabs browsers see: https://saucelabs.com/docs/platforms/webdriver
        customLaunchers: {
          'SL_Chrome': {
            base: 'SauceLabs',
            browserName: 'chrome'
          },
          'SL_Firefox': {
            base: 'SauceLabs',
            browserName: 'firefox'
          },
          'SL_Safari': {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.8',
            version: '6'
          },
          'SL_IE_8': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '8'
          },
          'SL_IE_9': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'windows 7',
            version: '9'
          },
          'SL_IE_10': {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'windows 8',
            version: '10'
          },
          'SL_iPad': {
            base: 'SauceLabs',
            browserName: 'ipad',
            platform: 'OS X 10.8',
            version: '6',
            'device-orientation': 'portrait'
          },
          'SL_iPhone': {
            base: 'SauceLabs',
            browserName: 'iphone',
            platform: 'OS X 10.8',
            version: '6',
            'device-orientation': 'portrait'
          },
          'SL_Android': {
            base: 'SauceLabs',
            browserName: 'android',
            platform: 'Linux',
            version: '4',
            'device-orientation': 'portrait'
          }
        }
      },

      headless: { browsers: ['PhantomJS'] },
      chrome: { browsers: ['Chrome'] },
      firefox: { browsers: ['Firefox'] },
      ie: { browsers: ['IE'] },
      opera: { browsers: ['Opera'] },
      safari: { browsers: ['Safari'] },

      linux: { browsers: ['Chrome', 'Firefox', 'Opera'] },
      osx: { browsers: ['Chrome', 'Firefox', 'Opera', 'Safari'] },
      windows: { browsers: ['Chrome', 'Firefox', 'IE', 'Opera', 'Safari'] },

      // SauceLabs Open Sauce allows max 2 concurrent browsers.
      'sl-chrome': { browsers: ['SL_Chrome'] },
      'sl-firefox': { browsers: ['SL_Firefox'] },
      'sl-ie8': { browsers: ['SL_IE_8'] },
      'sl-ie9': { browsers: ['SL_IE_9'] },
      'sl-ie10': { browsers: ['SL_IE_10'] },
      'sl-safari': { browsers: ['SL_Safari'] },
      'sl-ios': { browsers: ['SL_iPhone', 'SL_iPad'] },
      'sl-android': { browsers: ['SL_Android'] }
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
    'karma:headless'
  ]);

  grunt.registerTask('test:remote', [
    'karma:sl-chrome',
    'karma:sl-firefox',
    'karma:sl-ie8',
    'karma:sl-ie9',
    'karma:sl-ie10',
    'karma:sl-safari',
    'karma:sl-android',
    'karma:sl-ios'
  ]);
};
