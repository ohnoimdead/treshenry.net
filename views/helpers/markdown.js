var Marked = require('marked');

// HBS helper for markdown
module.exports = function(hbs) {
  hbs.registerHelper('markdown', function(text, options) {
    if(typeof(text) === 'string') {
      return new hbs.SafeString(Marked(text));
    }
  });
};
