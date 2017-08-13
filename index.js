var fs = require('fs');

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

WebpackTouch.prototype.write = function() {
  fs.writeFile(this.filename, 'DONE', {flag: 'w+'}, function(err) {
    if (err) {
      console.error(err)
    }
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
      setTimeout(this.write.bind(this), this.delay);
      return
    }
    this.write();
  }.bind(this));
};

module.exports = WebpackTouch;
