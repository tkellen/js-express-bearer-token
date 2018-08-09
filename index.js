const unsignCookie = require('cookie-signature').unsign;
const parseCookie = require('cookie').parse;

const getCookie = (serialized_cookies, key) => parseCookie(serialized_cookies)[key] || false;

module.exports = function(opts) {

  const {
    queryKey = 'access_token',
    bodyKey = 'access_token',
    headerKey = 'Bearer',
    reqKey = 'token',
    cookie = false,
  } = opts || {};

  const cookieKey = 'access_token';

  return function (req, res, next) {
    try {

      let token, error;

      // query
      if (req.query && req.query[queryKey]) {
        token = req.query[queryKey];
      }

      // body
      if (req.body && req.body[bodyKey]) {
        if (token) {
          error = true;
        }
        token = req.body[bodyKey];
      }

      // headers
      if (req.headers) {
        // authorization header
        if (req.headers.authorization) {
          var parts = req.headers.authorization.split(' ');
          if (parts.length === 2 && parts[0] === headerKey) {
            if (token) {
              error = true;
            }
            token = parts[1];
          }
        }

        // cookie
        if (cookie && req.headers.cookies) {

          if (cookie.signed && !cookie.secret) {
            throw new Error('[express-bearer-token]: You must provide a secret token to cookie attribute, or disable signed property');
          }

          if (!cookie.key) {
            cookie.key = cookieKey;
          }

          const plainCookie = getCookie(req.headers.cookies || '', cookie.key);
          const cookieToken = (cookie.signed) ? unsignCookie(plainCookie, cookie.secret) : plainCookie;
          
          if (cookieToken) {
            if (token) {
              error = true;
            }
            token = cookieToken;
          }
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
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
};
