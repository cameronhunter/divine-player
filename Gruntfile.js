module.exports = function(grunt) {

  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    source: "src",
    release: "release",
    test: "test",
    fixtures: "<%= test %>/fixtures",
    bower: "bower_components",
    temp: ".tmp",

    connect: {
      options: {
        hostname: "*",
        port: 9001,
        keepalive: true,
        debug: true,
        open: "http://localhost:<%= connect.options.port %>/embed"
      },
      dev: {
        options: {
          base: [
            "<%= source %>",
            "<%= test %>/integration/dev",
            "<%= test %>/integration/common",
            "<%= bower %>"
          ]
        }
      },
      release: {
        options: {
          base: [
            "<%= release %>",
            "<%= test %>/integration/release",
            "<%= test %>/integration/common",
            "<%= bower %>"
          ]
        }
      }
    },

    bump: {
      options: {
        files: ["package.json", "bower.json"],
        commit: true,
        commitMessage: "Release v%VERSION%",
        commitFiles: ["-a"], // "-a" for all files
        createTag: true,
        tagName: "v%VERSION%",
        tagMessage: "Version %VERSION%",
        push: true,
        pushTo: "origin",
        gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d" // options to use with "$ git describe"
      }
    },

    clean: {
      release: "<%= release %>",
      temp: "<%= temp %>"
    },

    concat: {
      options: {
        nonull: true,
        process: function(src, filepath) {
          return [
            "",
            "/******************************************************************************",
            " * " + filepath,
            " ******************************************************************************/",
            "",
            src
          ].join("\n")
        }
      },
      js: {
        src: [
          "<%= source %>/players/html5-player.js",
          "<%= source %>/players/flash-player.js",
          "<%= source %>/players/image-player.js",
          "<%= source %>/divine-player.js"
        ],
        dest: "<%= temp %>/divine-player.js"
      }
    },

    wrap: {
      build: {
        src: "<%= temp %>/divine-player.js",
        dest: "<%= temp %>/divine-player.js",
        options: {
          wrapper: ["var DivinePlayer = (function() {", "return DivinePlayer;}());"]
        }
      }
    },

    uglify: {
      options: {
        report: 'gzip',
        mangle: {
          except: ['DivinePlayer', 'HTML5Player', 'FlashPlayer', 'ImagePlayer']
        }
      },
      build: {
        options: {
          compress: {
            global_defs: {
              DEBUG: false
            }
          }
        },
        files: {
          "<%= temp %>/divine-player.min.js": "<%= temp %>/divine-player.js",
          "<%= temp %>/html5-video-shim.min.js": "<%= source %>/html5-video-shim.js"
        }
      },
      debug: {
        options: {
          beautify: true,
          compress: {
            global_defs: {
              DEBUG: true
            }
          }
        },
        files: {
          "<%= temp %>/divine-player.debug.js": "<%= temp %>/divine-player.js",
        }
      }
    },

    exec: {
      check_for_sauce_connect: {
        cmd: "ps aux | grep Sauce-Connect.jar | grep -v grep",
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
        files: [{expand: true, cwd: "<%= temp %>", src: "*", dest: "<%= release %>", filter: "isFile"}]
      }
    },

    karma: {
      options: {
        configFile: "karma.specs.conf.js"
      },
      "specs": { browsers: ["PhantomJS"] },
      "specs-chrome": { browsers: ["Chrome"] },
      "specs-firefox": { browsers: ["Firefox"] },
      "specs-ie": { browsers: ["IE"] },
      "specs-opera": { browsers: ["Opera"] },
      "specs-safari": { browsers: ["Safari"] },
      "specs-sl-ie": { browsers: ["SL_IE_8", "SL_IE_9", "SL_IE_10"] },
      "specs-sl-desktop": { browsers: ["SL_Chrome", "SL_Firefox", "SL_Safari"] },
      "specs-sl-mobile": { browsers: ["SL_iPhone", "SL_iPad", "SL_Android"] },
      "specs-release": {
        configFile: "karma.specs-release.conf.js",
        browsers: ["PhantomJS"]
      }
    }
  });

  grunt.registerTask("default", ["build"]);
  grunt.registerTask("test", ["karma:specs"]);
  grunt.registerTask("server", ["connect:dev"]);

  grunt.registerTask("server:release", [
    "build",
    "connect:release"
  ]);

  grunt.registerTask("build", [
    "test",
    "build:skiptests"
  ]);

  grunt.registerTask("build:skiptests", [
    "clean:release",
    "concat",
    "wrap:build",
    "uglify:build",
    "uglify:debug",
    "copy",
    "clean:temp"
  ]);

  grunt.registerTask("test:release", [
    "build:debug",
    "karma:specs-release"
  ]);

  grunt.registerTask("test:remote", [
    "exec:check_for_sauce_connect",
    "karma:specs-sl-desktop",
    "karma:specs-sl-ie",
    "karma:specs-sl-mobile"
  ]);
};
