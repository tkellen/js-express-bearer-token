module.exports = function(opts) {
  if (!opts) {
    opts = {};
  }
  var queryKey = opts.queryKey || 'access_token';
  var bodyKey = opts.bodyKey || 'access_token';
  var headerKey = opts.headerKey || 'bearer';
  return function (req, res, next) {
    var token;
    if (req.query && req.query[queryKey]) {
      token = req.query[queryKey];
    } else if (req.body && req.body[bodyKey]) {
      token = req.body[bodyKey];
    } else if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0].toLowerCase() === headerKey) {
        token = parts[1];
      }
    }
    req.token = token;
    next();
  };
};
