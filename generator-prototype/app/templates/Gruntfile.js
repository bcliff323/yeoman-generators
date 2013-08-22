module.exports = function (grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        recess: {
            options: {
                compile: true
            },
            bootstrap: {
                src: [
                    'bower_components/bootstrap/less/bootstrap.less'
                ],
                dest: 'dist/css/bootstrap.css'
            },
            custom: {
                src: [
                    'less/main.less'
                ],
                dest: 'dist/css/custom.css'
            },
            min: {
                options: {
                    compress: true
                },
                src: ['dist/css/bootstrap.css', 'dist/css/custom.css'],
                dest: 'dist/css/styles.min.css'
            }
        },

        jshint: {
            files: [
                'js/app/**/*.js'
            ],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        <% if (includeRequireJS) { %>
        requirejs: {
            compile: {
                options: {
                    baseUrl: "js/app",
                    mainConfigFile: "js/app/main.js",
                    out: "dist/js/app.min.js"
                }
            }
        },
        <% } else { %>
        concat: {
            jquery: {
                src: [
                'bower_components/jquery/jquery.min.js'
                ],
                dest: 'dist/js/jquery.min.js'
            },
            javascript: {
                src: [
                'js/lib/*.js',
                'bower_components/bootstrap/dist/js/bootstrap.js',
                'js/app/**/*.js'
                ],
                dest: 'dist/js/app.js'
            }
        },

        uglify: {
            bootstrap: {
                src: ['dist/js/app.js'],
                dest: 'dist/js/app.min.js'
            }
        },
        <% } %>
        connect: {
            server: {
                options: {
                    hostname: grunt.option('hostname') || 'localhost',
                    port: 3000,
                    base: '.',
                    keepalive: true
                }
            }
        },

        watch: {
            js: {
                files: [
                    'Gruntfile.js',
                    'js/app/**/*.js',
                    'less/**/*.less',
                    './index.html'
                ],
                tasks: ['default'],
                options: {
                    livereload: true
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-recess');

    <% if (!this.includeRequireJS) { %>
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');  
    grunt.registerTask('default', ['jshint', 'recess', 'concat', 'uglify']);
    <% } %>

    <% if (this.includeRequireJS) { %>
    grunt.loadNpmTasks('grunt-contrib-requirejs');   
    grunt.registerTask('default', ['jshint', 'recess', 'requirejs']);
    <% } %>
};