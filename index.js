var touch = require('touch');

function WebpackTouch(options) {
  var options = options || {};
  this.filename = options.filename;
  this.delay = options.delay? parseInt(options.delay) : 0;
  this.ignoreOnError = options.ignoreOnError;
  this.isEnabled = options.isEnabled !== undefined ? options.isEnabled : true;
  if (!this.filename) {
    throw new Error('Require filename option')
  }
}

WebpackTouch.prototype.touch = function() {
  touch(this.filename)
    .then(function(){}, function (err) {
      console.log("Touch error:", err);
    });
};

WebpackTouch.prototype.apply = function(compiler) {
  compiler.plugin("done", function(stats) {
    if (!this.isEnabled) {
      return;
    }
    if (this.ignoreOnError) {
      if (stats.hasErrors()) {
        console.log("Not touch on error");
        return;
      }
    }
    if (this.delay) {
      setTimeout(this.touch.bind(this), this.delay);
      return
    }
    this.touch();
  }.bind(this));
};

module.exports = WebpackTouch;
