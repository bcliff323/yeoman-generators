'use strict';

/*
 * Node dependencies
 */
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var PrototypeGenerator = module.exports = function PrototypeGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function () {
        /*
         * Installs dependencies in bower.json and package.json,
         * after all other yo processes complete.
         */
        this.installDependencies({
            skipInstall: options['skip-install']
        });
    });

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
};

util.inherits(PrototypeGenerator, yeoman.generators.Base);

PrototypeGenerator.prototype.askFor = function askFor() {
    var cb = this.async();

    // welcome message
    var welcome =
        '\n' + '============================================================'.red.bold +
        '\n' + 'YYY   YYY     OOOO             RRRRR      EEEEEEE   IIIIIIII'.red.bold +
        '\n' + ' YYY YYY     OOOOOO            RRR RRR    EEEEEEE   IIIIIIII'.red.bold +
        '\n' + '  YYYYY     OOO  OOO           RRR  RRR   EEE         IIII'.red.bold +
        '\n' + '   YYY     OOO    OOO   ***    RRR  RRR   EEEEE       IIII'.red.bold +
        '\n' + '   YYY     OOO    OOO   ***    RRRRRRR    EEEEE       IIII'.red.bold +
        '\n' + '   YYY     OOO    OOO   ***    RRRRRR     EEEEE       IIII'.red.bold +
        '\n' + '   YYY      OOO  OOO           RRR RRR    EEE         IIII'.red.bold +
        '\n' + '   YYY       OOOOOO            RRR  RRR   EEEEEEE   IIIIIIII'.red.bold +
        '\n' + '   YYY        OOOO             RRR   RRR  EEEEEEE   IIIIIIII'.red.bold +
        '\n' + '============================================================'.red.bold +
        '\n' +
        '\n' +
        '\n' +
        '\n     _-----_' +
        '\n    |       |' +
        '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
        '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
        '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + '      REI FEDs!'.yellow.bold + '     |' +
        '\n    /___A___\\   \'__________________________\'' +
        '\n     |  ~  |'.yellow +
        '\n   __' + '\'.___.\''.yellow + '__' +
        '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

    console.log(welcome);

    /*
     * Prompt dialog config.
     */
    var prompts = [{
        name: 'projectName',
        message: 'What would you like to name this project?'
    }, {
        type: 'checkbox',
        name: 'features',
        message: 'What more would you like?',
        choices: [{
            name: 'RequireJS',
            value: 'includeRequireJS',
            checked: false
        }]
    }];

    this.prompt(prompts, function (props) {
        var features = props.features;

        /*
         * If a prompt object has the feature passed here,
         * return true, otherwise, return false.
         */
        function hasFeature(feat) {
            return features.indexOf(feat) !== -1;
        }

        this.projectName = props.projectName;
        this.includeRequireJS = hasFeature('includeRequireJS');

        cb();
    }.bind(this));
};

/*
 * Scaffold out the project directory. Name directory after
 * prompt entry.
 */
PrototypeGenerator.prototype.app = function app() {
    this.mkdir(this.projectName);
    process.chdir(this.projectName);
    this.mkdir('assets');
    this.mkdir('dist');
    this.mkdir('js');
    this.mkdir('js/lib');
    this.mkdir('js/app');
    this.mkdir('less');
};

/*
 * Generate index.html
 */
PrototypeGenerator.prototype.writeIndex = function writeIndex() {
    var indexText = [
        '<!DOCTYPE html>',
        '<html>',
        '    <head>',
        '        <title>' + this.projectName + '</title>',
        '        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">',
        '        <meta http-equiv="X-UA-Compatible" content="IE=edge">',
        '        <link href="dist/css/styles.min.css" rel="stylesheet" media="screen">',
        ''
    ];

    indexText = indexText.concat([
        '        <!--',
        '',
        '        CSS:',
        '        ====',
        '        I\'ve included a less file for any custom css we\'d like to add. I was going',
        '        to throw any and all css into that and worry about re-factoring later.', 
        '        This file can be found here:',
        '',
        '        less/rei-layout.less',
        '',
        '        Grunt:',
        '        ======',
        '        From this directory, run these two commands to see the page at localhost:3000/,',
        '        and to run a watch, which runs a grunt build whenever less/js files are edited.',
        '',
        '        to start the server     ->      grunt connect',
        '        to start a watch        ->      grunt watch',
        '',
        '        -->',
        '    </head>',
        '    <body>',
        '',
        '',
        '        <!-- Enables livereload. Remove in production -->',
        '        <script src="http://localhost:35729/livereload.js"></script>',
        ''
    ]);

    if(this.includeRequireJS) {
        indexText = indexText.concat([
        '        <script', 
        '            type="text/javascript"',
        '            data-main="/js/main"', 
        '            src="/js/lib/require.js"></script>'
        ]);
    } else {
        indexText = indexText.concat([
        '        <script src="dist/js/jquery.min.js"></script>',
        '', 
        '        <!-- App js -->',
        '        <script src="dist/js/app.min.js"></script>'
        ]);
    }

    indexText = indexText.concat([
        '',
        '        <!-- Enable responsive features in IE8 with Respond.js (https://github.com/scottjehl/Respond) -->',
        '        <!--[if lt IE 9]>',
        '        <script src="js/lib/respond.min.js"></script>',
        '        <![endif]-->',
        '    </body>',
        '</html>'
    ]);

    this.indexFile = indexText.join('\n');
    this.write('index.html', this.indexFile);
}

/*
 * Copy requirejs files.
 */
PrototypeGenerator.prototype.requireJS = function requireJS() {
    if(this.includeRequireJS) {
        this.copy('require.js', 'js/lib/require.js');
        this.copy('main.js', 'js/app/main.js');
        this.copy('app.js', 'js/app/app.js');
    }
};

/*
 * Copy main.less
 */
PrototypeGenerator.prototype.less = function less() {
    this.copy('main.less', 'less/main.less');
    this.copy('variables.less', 'less/variables.less')
}

/*
 * Copy GruntFile.js
 */
PrototypeGenerator.prototype.gruntfile = function gruntfile() {
    this.copy('Gruntfile.js', 'Gruntfile.js');
};

/*
 * Copy package.json
 */
PrototypeGenerator.prototype.packageJSON = function packageJSON() {
    this.template('_package.json', 'package.json');
};

/*
 * Copy .gitignore
 */
PrototypeGenerator.prototype.git = function git() {
    this.copy('.gitignore', '.gitignore');
};

/*
 * Copy bower.json
 */
PrototypeGenerator.prototype.bower = function bower() {
    this.copy('_bower.json', 'bower.json');
};

/*
 * Copy .jshintrc
 */
PrototypeGenerator.prototype.jshint = function projectfiles() {
    this.copy('jshintrc', '.jshintrc');
};

/*
 * Copy .editorconfig
 */
PrototypeGenerator.prototype.editorconfig = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    process.chdir('../');
};

