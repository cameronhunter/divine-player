module.exports = function(grunt) {

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    source: 'src',
    target: 'release',
    temp: '.tmp',

    clean: {
      build: ['<%= temp %>', '<%= target %>'],
      temp: ['<%= temp %>']
    },

    uglify: {
      build: {
        files: {
          '<%= temp %>/js/divine-player.min.js': [
            '<%= source %>/javascript/html5-player.js',
            '<%= source %>/javascript/flash-player.js',
            '<%= source %>/javascript/divine-player.js'
          ],
          '<%= temp %>/js/html5-video-shim.min.js': [
            '<%= source %>/javascript/html5-video-shim.js'
          ]
        }
      }
    },

    wrap: {
      build: {
        src: '<%= temp %>/js/divine-player.min.js',
        dest: '<%= temp %>/js/divine-player.min.js',
        options: {
          wrapper: ['(function() {', 'return DivinePlayer;}());']
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
        cmd: 'mxmlc <%= source %>/actionscript/Player.as -o <%= temp %>/swf/divine-player.swf -use-network=false -static-link-runtime-shared-libraries=true'
      }
    },

    copy: {
      build: {
        files: [
          {expand: true, cwd: '<%= temp %>', src: 'js/*', dest: '<%= target %>', filter: 'isFile'},
          {expand: true, cwd: '<%= temp %>', src: 'swf/*', dest: '<%= target %>', filter: 'isFile'}
        ]
      }
    }

  });

  grunt.registerTask('build', [
      'clean:build',
      'uglify:build',
      'wrap:build',
      'exec:check_for_mxmlc',
      'exec:build_swf',
      'copy:build',
      'clean:temp'
  ]);
};
