'use strict';

var util = require('../util/index'),
    object = util.object,
    string = util.string;

/**
 * Documentation object
 * @param {Object} doc  Object containing properties:
 *                      {String} name
 *                      {String} category
 *                      {String[]} syntax
 *                      {String[]} examples
 *                      {String[]} seealso
 * @param {Object} math The math.js namespace
 * @constructor
 */
function Help (doc, math) {
  if (!(this instanceof Help)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  if (!doc)  throw new Error('Argument "doc" missing');
  if (!math) throw new Error('Argument "math" missing');

  this.doc = doc;
  this.math = math;
}

/**
 * Test whether a value is an instance of Help
 * @param {*} value
 * @return {Boolean} isHelp
 */
Help.isHelp = function (value) {
  return (value instanceof Help);
};

/**
 * Generate readable description from a Help object
 * @return {String} readableDoc
 * @private
 */
Help.prototype.toString = function () {
  var doc = this.doc || {};
  var desc = '\n';

  if (doc.name) {
    desc += 'Name: ' + doc.name + '\n\n';
  }
  if (doc.category) {
    desc += 'Category: ' + doc.category + '\n\n';
  }
  if (doc.description) {
    desc += 'Description:\n    ' + doc.description + '\n\n';
  }
  if (doc.syntax) {
    desc += 'Syntax:\n    ' + doc.syntax.join('\n    ') + '\n\n';
  }
  if (doc.examples) {
    var parser = this.math.parser();
    desc += 'Examples:\n';
    for (var i = 0; i < doc.examples.length; i++) {
      var expr = doc.examples[i];
      var res;
      try {
        res = parser.eval(expr);
      }
      catch (e) {
        res = e;
      }
      desc += '    ' + expr + '\n';
      if (res !== undefined && !(res instanceof Help)) {
        desc += '        ' + string.format(res, {precision: 14}) + '\n';
      }
    }
    desc += '\n';
  }
  if (doc.seealso) {
    desc += 'See also: ' + doc.seealso.join(', ') + '\n';
  }

  return desc;
};

/**
 * Export the help object to JSON
 */
Help.prototype.toJSON = function () {
  var obj = object.clone(this.doc);
  obj['@type'] = 'Help';
  return obj;
};

/**
 * Instantiate a Help object from a JSON object
 * @param {Object} json
 * @param {Object} math   An instance of mathjs
 * @returns {Help} Returns a new Help object
 */
Help.prototype.fromJSON = function (json, math) {
  return new Help(json, math);
};

/**
 * Returns a string representation of the Help object
 */
Help.prototype.valueOf = Help.prototype.toString;

// exports
module.exports = Help;