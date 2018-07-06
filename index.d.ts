// Type definitions for express-bearer-token 2.1.1
// Project: https://github.com/tkellen/js-express-bearer-token
// Definitions by: Jan-Joost den Brinker <https://github.com/jjdbrinker>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.2

/* =================== USAGE ===================

    import * as bearerToken from "express-bearer-token";
    app.use(bearerToken({
        bodyKey: 'access_token',
        queryKey: 'access_token',
        headerKey: 'Bearer',
        reqKey: 'token'
    }));

 =============================================== */

import * as express from "express";

/**
 * This module will attempt to extract a bearer token from a request from these locations:
 * - The key access_token in the request body.
 * - The key access_token in the request params.
 * - The value from the header Authorization: Bearer <token>.
 * 
 * If a token is found, it will be stored on req.token. 
 * If a token has been provided in more than one location, the request will be aborted immediately with HTTP status code 400 (per RFC6750).
 * 
 * To change the variables used by this module, you can specify an object with new options.
 */
declare function bearerToken(options?: bearerToken.BearerTokenOptions): express.Handler;

declare namespace bearerToken {
    interface BearerTokenOptions {
        /**
         * Specify the key that will be used to find the token in the request body.
         */
        bodyKey?: string;

        /**
         * Specify the key that will be used to find the token in the request params.
         */
        queryKey? : string;

        /**
         * Specify the value that will be used to find the token in the request header.
         */
        headerKey?: string;

        /**
         * Specify the key that will be used to bind the token to (if found on the request).
         */
        reqKey?: string;
    }
    function bearerToken(options?: BearerTokenOptions): express.Handler;
}

export = bearerToken;
