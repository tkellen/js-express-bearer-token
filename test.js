const expect = require('chai').expect;
const bearerToken = require('./');
const cookie = require('cookie-signature');

describe('bearerToken', function () {
  const token = 'test-token';
  const secret = 'SUPER_SECRET';

  it('finds a bearer token in post body under "access_token" and sets it to req.token', function (done) {
    const req = {body:{access_token:token}};
    bearerToken('secret')(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in query string under "access_token" and sets it to req.token', function (done) {
    const req = {query:{access_token:token}};
    bearerToken()(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in headers under "authorization: bearer" and sets it to req.token', function (done) {
    const req = {headers:{authorization:'Bearer '+token}};
    bearerToken()(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in post body under an arbitrary key and sets it to req.token', function (done) {
    const req = {body:{test:token}};
    bearerToken({bodyKey:'test'})(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in query string under "access_token" and sets it to req.token', function (done) {
    const req = {query:{test:token}};
    bearerToken({queryKey:'test'})(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in headers under "authorization: <anykey>" and sets it to req.token', function (done) {
    const req = {headers:{authorization:'test '+token}};
    bearerToken({headerKey:'test'})(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in header SIGNED cookies[<anykey>] and sets it to req.token', function (done) {
    // simulate the res.cookie signed prefix 's:'
    const signedCookie = encodeURI('s:' + cookie.sign(token, secret)); 
    const req = { headers: { cookie: 'test=' + signedCookie + '; ' } };
    bearerToken({ cookie: { key:'test', signed: true, secret: secret } })(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in header NON SIGNED cookies[<anykey>] and sets it to req.token', function (done) {
    const req = {headers:{cookie: 'test='+token+'; '}};
    bearerToken({cookie:{key: 'test'}})(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token and sets it to req[<anykey>]', function (done) {
    const req = {body:{access_token:token}};
    const reqKey = 'test';
    bearerToken({reqKey:reqKey})(req, {}, function() {
      expect(req[reqKey]).to.equal(token);
      done();
    });
  });

  

  it('aborts with 400 if token is provided in more than one location', function (done) {
    const req = {
      query: {
        access_token: 'query-token'
      },
      body: {
        access_token: 'query-token'
      },
      headers: {
        authorization: 'bearer header-token',
        cookies: 'access_token=cookie-token;'
      },
    };
    const res = {
      status: function (code) {
        res.code = code;
        return res;
      },
      send: function () {
        expect(res.code).to.equal(400);
        done();
      }
    }
    bearerToken()(req, res);
  });

  


});
