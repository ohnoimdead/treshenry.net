var Marked = require('marked');

var imgRegex = /^\!img\ (.*)$/gm;

// HBS helper for markdown
module.exports = function(hbs) {
  hbs.registerHelper('markdown', function(text, options) {
    if(typeof(text) === 'string') {

      // Pre-processor for !img token (makes adding images with correct formatting easier)
      text = text.replace(imgRegex, function(m, src) {
        return '<span class="postaimg"><img src="' + src + '"></span>';
      });

      // Now parse as md
      return new hbs.SafeString(Marked(text));
    }
  });
};
