const expect = require('chai').expect;
const bearerToken = require('./');

describe('bearerToken', function () {
  var token = 'test-token';

  it('finds a bearer token in post body under "access_token" and sets it to req.token', function (done) {
    var req = {body:{access_token:token}};
    bearerToken(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in query string under "access_token" and sets it to req.token', function (done) {
    var req = {query:{access_token:token}};
    bearerToken(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('finds a bearer token in headers under "authorization" and sets it to req.token', function (done) {
    var req = {headers:{authorization:'Bearer '+token}};
    bearerToken(req, {}, function () {
      expect(req.token).to.equal(token);
      done();
    });
  });

  it('stops looking for token after first is found', function (done) {
    var req = {
      query: {
        access_token: 'query-token'
      },
      body: {
        access_token: 'query-token'
      },
      headers: {
        authorization: 'bearer header-token'
      },
    };
    bearerToken(req, {}, function () {
      expect(req.token).to.equal(req.query.access_token);
      delete req.query;
      bearerToken(req, {}, function () {
        expect(req.token).to.equal(req.body.access_token);
        done();
      });
    });
  });


});
