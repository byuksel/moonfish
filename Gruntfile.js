'use strict';

module.exports = function(grunt) {

  // measures the time each task takes
  require('time-grunt')(grunt);
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),  // Parse package.json info
    env: {
      test: {
        NODE_TEST: 'test',
      },
      dist: {
        NODE_TEST: null,
      }

    },
    // jshint all the src files.
    jshint: {
      options: {
	eqeqeq: true,
	trailing: true
      },
      target: {
	src : ['lib/**/*.js',
               'test/**/*.js',
               '!lib/garbage/**/*',]
      }
    },
    // use blanket to get coverage stats on mocha tests
    mocha_cov: {
      options: {
        instrument: false,
        coveralls: true,
        reporter: 'spec',
        require: ['should']
      },
      all: ['test/**/*.js']
    },

    // run the mocha tests via Node.js
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          // require: 'coverage/blanket',
          captureFile: 'test/output/output.txt'
        },
        
        src: ['test/**/*.js']
      }
    },
    // remove all previous browserified builds
    clean: {
      dist: ['./browser/dist/**/*'],
      tests: ['./browser/test/browserified_tests.js',
              './test/output/**/*']
    },
    // Parse AST for require() and build the browser code.
    browserify: {
      standalone: {
        src: [ 'moonfish.js' ],
        dest: './browser/dist/<%= pkg.name %>.<%= pkg.version %>.standalone.js',
        options: {
          standalone: '<%= pkg.name %>',
          alias: {
            'moonfish': './<%= pkg.name %>.js'
          }
        }
      },
      tests: {
        src: [ 'browser/test/suite.js' ],
        dest: './browser/test/browserified_tests.js',
        options: {
          external: [ './index.js' ],
          // Embed source map for tests
          debug: true
        }
      }
    },
    // Start the basic web server from connect.
    connect: {
      server: {},
      keepalive: {
        options: {
          keepalive: true
        }
      }
    },
    // run the mocha tests in the browser via PhantomJS
    mocha_phantomjs: {
      all: {
        options: {
          urls: [
            'http://127.0.0.1:8000/browser/test/index.html'
          ]
        }
      }
    },
    // uglify our one moonfish.js file.
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>.<%= pkg.version %>.<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          // Uglify browserified library
          'browser/dist/<%= pkg.name %>.<%= pkg.version %>.standalone.min.js':
          ['<%= browserify.standalone.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.registerTask('test2', ['mocha_cov']);
  grunt.registerTask('dist', ['env:dist', 'clean', 'browserify', 'uglify']);
  grunt.registerTask('localtest', ['env:test', 'clean', 'jshint', 'mochaTest']);
  grunt.registerTask('browsertest', ['env:test', 'clean', 'jshint', 'browserify', 'connect:server', 'mocha_phantomjs']);
  grunt.registerTask('test', ['localtest', 'browsertest']);
  grunt.registerTask('default', ['test', 'dist']);
};


