module.exports = function(title, date) {
  title = title.replace(/^\s+|\s+$/g, ''); // trim
  title = title.toLowerCase();

  // remove accents
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;–";
  var to   = "aaaaeeeeiiiioooouuuunc-------";
  for (var i=0, l=from.length ; i<l ; i++) {
    title = title.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  title = title.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" + title;
};
