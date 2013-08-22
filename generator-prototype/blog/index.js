'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var BlogGenerator = module.exports = function BlogGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the blog subgenerator with the argument ' + this.name + '.');
};

util.inherits(BlogGenerator, yeoman.generators.NamedBase);

BlogGenerator.prototype.files = function files() {
  this.copy('somefile.js', 'somefile.js');
};
