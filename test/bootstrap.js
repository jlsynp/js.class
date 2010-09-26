// A small set of tests designed to drive the writing
// of a new core until it's powerful enough to run all
// the JS.Test specs.

require('../build/min/core');
var assert = require('assert'),
    sys    = require('sys');

var Klass = new JS.Class();
assert.ok(Klass instanceof Function);

var Klass = new JS.Class({
  initialize: function(name, age) {
    this.name = name;
    this.age  = age;
  }
});
var object = new Klass('jcoglan', 26);
assert.equal('jcoglan', object.name);
assert.equal(26, object.age);

var Klass = new JS.Class('Klass', {
  initialize: function(name, age) {
    this.name = name;
    this.age  = age;
  },
  sayHello: function() {
    return 'Hello, ' + this.name;
  }
});
var object = new Klass('jcoglan', 26);
assert.equal('jcoglan', object.name);
assert.equal(26, object.age);
assert.equal('Hello, jcoglan', object.sayHello());

var Sub = new JS.Class(Klass, {
  sayBye: function() {
    return 'Bye, ' + this.name;
  }
});
var object = new Sub('jcoglan', 26);
assert.equal('Hello, jcoglan', object.sayHello());
assert.equal('Bye, jcoglan', object.sayBye());

sys.puts('Done.');
