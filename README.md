# express-bearer-token [![Build Status](https://secure.travis-ci.org/tkellen/node-express-bearer-token.png)](http://travis-ci.org/tkellen/node-express-bearer-token)
> Bearer token middleware for express.

[![NPM](https://nodei.co/npm/express-bearer-token.png)](https://nodei.co/npm/express-bearer-token/)

## What?

This extracts a bearer token from a request and places it on `req.token`.  It looks for the token in three places, stopping at the first one found, in this order:

1. The key `access_token` in the request body.
2. The key `access_token` in the request params.
3. The value from the header `Authorization: bearer <token>`.


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

The key to look under for the token in each location is customizable like so (default configuration shown):
```js
app.use(bearerToken({
  bodyKey: 'access_token',
  queryKey: 'access_token',
  headerKey 'bearer'
}))
```
