module.exports = function (req, res, next) {
  var token;
  if (req.query && req.query.access_token) {
    token = req.query.access_token;
  } else if (req.body && req.body.access_token) {
    token = req.body.access_token;
  } else if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
      token = parts[1];
    }
  }
  req.token = token;
  next();
};
