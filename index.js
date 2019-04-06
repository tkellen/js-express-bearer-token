const parseCookie = require('cookie').parse;
const decodeCookie = require('cookie-parser').signedCookie;

const getCookie = (serialized_cookies, key) => parseCookie(serialized_cookies)[key] || false;

module.exports = opts => {
  try {
    if (!opts) {
      opts = {
        cookie: false,
      };
    }

    const queryKey = opts.queryKey || 'access_token';
    const bodyKey = opts.bodyKey || 'access_token';
    const headerKey = opts.headerKey || 'Bearer';
    const reqKey = opts.reqKey || 'token';
    const cookie = opts.cookie;

    if (cookie && !cookie.key) {
      cookie.key = 'access_token';
    }

    if (cookie && cookie.signed && !cookie.secret) {
      throw new Error(
        '[express-bearer-token]: You must provide a secret token to cookie attribute, or disable signed property'
      );
    }

    return (req, res, next) => {
      let token;
      let error;

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
          const parts = req.headers.authorization.split(' ');
          if (parts.length === 2 && parts[0] === headerKey) {
            if (token) {
              error = true;
            }
            token = parts[1];
          }
        }

        // cookie
        if (cookie && req.headers.cookie) {
          const plainCookie = getCookie(req.headers.cookie || '', cookie.key); // seeks the key
          if (plainCookie) {
            const cookieToken = cookie.signed
              ? decodeCookie(plainCookie, cookie.secret)
              : plainCookie;

            if (cookieToken) {
              if (token) {
                error = true;
              }
              token = cookieToken;
            }
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
    };
  } catch (e) {
    console.error(e);
  }
};
