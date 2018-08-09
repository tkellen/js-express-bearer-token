# express-bearer-token [![Build Status](https://secure.travis-ci.org/tkellen/js-express-bearer-token.png)](http://travis-ci.org/tkellen/js-express-bearer-token)
> Bearer token middleware for express.

[![NPM](https://nodei.co/npm/express-bearer-token.png)](https://nodei.co/npm/express-bearer-token/)

## What?

Per [RFC6750] this module will attempt to extract a bearer token from a request from these locations:

* The key `access_token` in the request body.
* The key `access_token` in the request params.
* The value from the header `Authorization: Bearer <token>`.
* (Optional) Get a token from cookies header with key `access_token`.

If a token is found, it will be stored on `req.token`.  If one has been provided in more than one location, this will abort the request immediately by sending code 400 (per [RFC6750]).

```js
const express = require('express');
const bearerToken = require('express-bearer-token');
const app = express();

app.use(bearerToken());
app.use(function (req, res) {
  res.send('Token '+req.token);
});
app.listen(8000);
```

For APIs which are not compliant with [RFC6750], the key for the token in each location is customizable, as is the key the token is bound to on the request (default configuration shown):
```js
app.use(bearerToken({
  bodyKey: 'access_token',
  queryKey: 'access_token',
  headerKey: 'Bearer',
  reqKey: 'token',
  cookie: false, // by default is disabled
}));
```

Get token from cookie key (it can be signed or not)

**Warning**: by __NOT__ passing `{signed: true}` you are accepting a non signed cookie and an attacker might spoof the cookies. so keep in mind to use signed cookies
```js
app.use(bearerToken({
  cookie: {
    signed: true, // if passed true you must pass secret otherwise will throw error
    secret: 'YOUR_APP_SECRET',
    key: 'access_token' // default value
  }
}));

```

As of version 2.2.0 we've added initial support for TypeScript. 

[RFC6750]: https://xml.resource.org/html/rfc6750
