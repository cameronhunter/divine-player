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

    sauceLabs: {
      username: "CameronHunter",
      accessKey: "2bf6bee8-218e-46f9-83e4-01b9d7c23ca4"
    },

    connect: {
      options: {
        hostname: '*',
        port: 9001,
        keepalive: true,
        debug: true,
        open: 'http://localhost:<%= connect.options.port %>/embed'
      },
      dev: {
        options: {
          base: [
            '<%= source %>',
            '<%= test %>/integration/dev',
            '<%= test %>/integration/common',
            '<%= bower %>'
          ]
        }
      },
      release: {
        options: {
          base: [
            '<%= release %>',
            '<%= test %>/integration/release',
            '<%= test %>/integration/common',
            '<%= bower %>'
          ]
        }
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'], // '-a' for all files
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    },

    clean: {
      release: '<%= release %>',
      temp: '<%= temp %>'
    },

    uglify: {
      build: {
        files: {
          '<%= temp %>/divine-player.min.js': [
            '<%= source %>/players/html5-player.js',
            '<%= source %>/players/flash-player.js',
            '<%= source %>/divine-player.js'
          ],
          '<%= temp %>/html5-video-shim.min.js': [
            '<%= source %>/html5-video-shim.js'
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
          '<%= source %>/html5-video-shim.js',
          '<%= source %>/players/*.js',
          '<%= source %>/divine-player.js',

          // Stub player for testing
          '<%= test %>/specs/players/stub-player.js',

          // Test libraries
          '<%= bower %>/jquery/jquery.js',
          '<%= bower %>/jasmine-jquery/lib/jasmine-jquery.js',
          '<%= test %>/specs/jasmine-helpers/jasmine-cit.js',
          '<%= test %>/specs/jasmine-helpers/jasmine-helpers.js',

          // Behaviour specifications
          'test/specs/**/*.spec.js',

          // Fixtures for use in tests cases
          {pattern: '<%= fixtures %>/*', included: false, served: true},

          // Needed for testing Flash player
          {pattern: '<%= bower %>/divine-player-swf/release/divine-player.swf', included: false, served: true}
        ],

        sauceLabs: {
          username: "<%= sauceLabs.username %>",
          accessKey: "<%= sauceLabs.accessKey %>",
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

      // SauceLabs Open Sauce allows max 3 concurrent browsers.
      'sl-ie': { browsers: ['SL_IE_8', 'SL_IE_9', 'SL_IE_10'] },
      'sl-desktop': { browsers: ['SL_Chrome', 'SL_Firefox', 'SL_Safari'] },
      'sl-mobile': { browsers: ['SL_iPhone', 'SL_iPad', 'SL_Android'] }
    },

    wrap: {
      build: {
        src: '<%= temp %>/divine-player.min.js',
        dest: '<%= temp %>/divine-player.min.js',
        options: {
          wrapper: ['var DivinePlayer = (function() {', 'return DivinePlayer;}());']
        }
      }
    },

    exec: {
      check_for_sauce_connect: {
        cmd: 'ps aux | grep Sauce-Connect.jar | grep -v grep',
        callback: function(error) {
          if (error) {
            grunt.log.writeln("You need to run Sauce Connect manually in the background while running these tests");
            grunt.log.writeln("Instructions here: https://saucelabs.com/docs/connect\n");
            grunt.log.writeln("If you have it already, run:");
            grunt.log.writeln("java -jar Sauce-Connect.jar <%= sauceLabs.username %> <%= sauceLabs.accessKey %>\n");
          }
        }
      }
    },

    copy: {
      js: {
        files: [{expand: true, cwd: '<%= temp %>', src: '*', dest: '<%= release %>', filter: 'isFile'}]
      }
    }

  });

  grunt.registerTask('default', ['build']);

  grunt.registerTask('server', ['connect:dev']);

  grunt.registerTask('server:release', [
    'build',
    'connect:release'
  ]);

  grunt.registerTask('build', [
    'test',
    'build:skiptests'
  ]);

  grunt.registerTask('build:skiptests', [
    'clean:release',
    'uglify:build',
    'wrap:build',
    'copy:js',
    'clean:temp'
  ]);

  grunt.registerTask('test', [
    'karma:headless'
  ]);

  grunt.registerTask('test:remote', [
    'exec:check_for_sauce_connect',
    'karma:sl-desktop',
    'karma:sl-ie',
    'karma:sl-mobile'
  ]);

  grunt.registerTask('release', [
    'build',
    'bump'
  ]);

  grunt.registerTask('release:patch', [
    'build',
    'bump:patch'
  ]);

  grunt.registerTask('release:minor', [
    'build',
    'bump:minor'
  ]);

  grunt.registerTask('release:major', [
    'build',
    'bump:major'
  ]);
};
