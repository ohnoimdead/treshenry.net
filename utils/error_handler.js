module.exports = function(err, res, callback) {
  if(err) {
    console.error(err);
    res.send(500, { error: 'Eek! Something bad happened.' });
  } else {
    callback();
  }
};

