var Footer = require('../../models/footer');

module.exports = function(hbs) {
  hbs.registerAsyncHelper('footer', function(obj, callback) {
    Footer.findOne({}, function(err, footer) {
      if(err) {
        callback("");
      } else {
        callback(footer.content);
      }
    });
  });
}

