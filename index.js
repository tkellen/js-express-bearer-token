module.exports = function(opts) {
  if (!opts) {
    opts = {};
  }
  var queryKey = opts.queryKey || 'access_token';
  var bodyKey = opts.bodyKey || 'access_token';
  var headerKey = opts.headerKey || 'Bearer';
  var reqKey = opts.reqKey || 'token';
  return function (req, res, next) {
    var token, error;

    if (req.query && req.query[queryKey]) {
      token = req.query[queryKey];
    }

    if (req.body && req.body[bodyKey]) {
      if (token) {
        error = true;
      }
      token = req.body[bodyKey];
    }

    if (req.headers && req.headers.authorization) {
      var parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === headerKey) {
        if (token) {
          error = true;
        }
        token = parts[1];
      }
    }

    // RFC6750 states the access_token MUST NOT be provided
    // in more than one place in a single request.
    if (error) {
      res.status(400).send();
    } else {
      req[reqKey] = token;
      next();
    }
  };
};
