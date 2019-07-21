module.exports = function (grunt) {

    var LIVERELOAD_PORT = 35739;
    var isCordovaBuild = false;

    function mountFolder(connect, dir) {
        return connect.static(require('path').resolve(dir));
    }

    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-rename');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-open');

    grunt.initConfig({
        mkdir: {
            www: {
                options: {
                    mode: 0700,
                    create: ['www']
                }
            }
        },

        rename: {
            'www': 'app_dist'
        },

        shell: {
            addAndroid: {
                command: 'cordova platform add android'
            },

            prepare: {
                command: 'cordova prepare'
            },

            cordova: {
                command: 'cordova build'
            },

            'cordova-run-android': {
                command: 'cordova run android'
            }
        },

        open: {
            dev: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },

        connect: {
            options: {
                port: 8080,
                hostname: '0.0.0.0'
            },
            dev: {
                options: {
                    middleware: function (connect) {
                        return [
                            require('connect-livereload')({
                                port: LIVERELOAD_PORT
                            }),
                            mountFolder(connect, 'app')
                        ];
                    }
                }
            }
        },

        clean: {
            build: ['./app_dist/**/*', './.tmp', './www'],
            cordovajs: ['./www/cordova.js', './app_dist/cordova.js']
        },

        sass: {
            development: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'app/style.css': 'app/style/style.scss'
                }
            },
            production: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'app/style.css': 'app/style/style.scss'
                }
            }
        },

        watch: {
            styles: {
                files: ['app/style/**/*.scss'],
                tasks: ['sass:development'],
                spawn: false
            },
            livereload: {
                options: {livereload: LIVERELOAD_PORT},
                files: ['app/**/*']
            },
            jshint: {
                files: ['app/**/*.js'],
                tasks: ['jshint']
            }
        },

        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'app/images/',
                        src: ['**'],
                        dest: 'app_dist/images'
                    },
                    {
                        expand: true,
                        cwd: 'app/sounds/',
                        src: ['**'],
                        dest: 'app_dist/sounds'
                    },
                    {
                        expand: true,
                        cwd: 'app/languages/',
                        src: ['**'],
                        dest: 'app_dist/languages'
                    },
                    {
                        expand: true,
                        cwd: 'app/fonts/',
                        src: ['**'],
                        dest: 'app_dist/fonts'
                    },
                    {
                        expand: true,
                        cwd: 'app/views/',
                        src: ['**'],
                        dest: 'app_dist/views'
                    },
                    {
                        src: ['app/index.html'],
                        dest: 'app_dist/index.html'
                    },
                    {
                        src: ['app/style.css'],
                        dest: 'app_dist/style.css'
                    }
                ],
            },
        },

        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'app_dist',
                flow: {
                    steps: {
                        cordova: ['concat'],
                        js: ['concat', 'uglifyjs'],
                        css: ['concat', 'cssmin']
                    },
                    post: {}
                }
            }
        },

        usemin: {
            html: 'app_dist/index.html',
            options: {
                assetsDirs: ['app_dist'],
                blockReplacements: {
                    cordova: function (block) {
                        return isCordovaBuild ? block.raw.join('\n') : '';
                    }
                }
            }
        },

        concat: {
            options: {
                separator: ';',
                stripBanners: true
            }
        },

        uglify: {
            options: {
                mangle: false,
                ASCIIOnly: true
            }
        },
        jshint: {
            options: {
                bitwise: true,
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                regexp: true,
                undef: true,
                unused: true,
                strict: true,
                trailing: true,
                indent: 4,
                quotmark: 'single',
                maxlen: 120,
                sub: true,
                browser: true,
                node: true,
                browser: true,
                globals: {
                    jQuery: true
                },
                ignores: ['app/bower_components/**/*.js'],
                reporter: require('jshint-stylish')
            },
            uses_defaults: ['app/**/*.js']
        },
    });

    grunt.registerTask('build', function (param) {

        if (param === "cordova") {
            isCordovaBuild = true;
        }

        grunt.task.run([
            'clean:build',
            'sass:production',
            'useminPrepare',
            'copy:main',
            'concat',
            'uglify',
            'usemin:html',
            'clean:cordovajs'
        ]);
    });

    grunt.registerTask('prepare', ['mkdir:www', 'shell:addAndroid', 'shell:prepare', 'clean']);
    grunt.registerTask('serve', ['connect', 'open:dev', 'watch']);
    grunt.registerTask('cordova-build', ['build:cordova', 'rename', 'shell:cordova', 'clean:build']);
    grunt.registerTask('cordova-run-android', ['build:cordova', 'rename', 'shell:cordova-run-android', 'clean:build']);
};
