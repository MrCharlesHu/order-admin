var session = require('express-session');
var RedisStore = require('connect-redis')(session);
// const Seconds = require('../const/seconds');
var RedisConn = require('./../config').RedisConn;
const RedisConf = require('./config');

function initSession(app) {
  var options = {
    host: RedisConn.host,
    port: RedisConn.port,
    pass: RedisConn.pass,
    db: RedisConf.Families.SESSION
    // ttl: Seconds.LOGIN_EXPIRE_SECONDS// Redis session TTL (expiration) in seconds
  };
  /**
   * Session data is not saved in the cookie itself, just the session ID. Session data is stored server-side.
   */
  app.use(session({
    // The session store instance
    store: new RedisStore(options),
    // This is the secret used to sign the session ID cookie. This can be either a string for a single secret,
    // or an array of multiple secrets. If an array of secrets is provided, only the first element will be used to
    // sign the session ID cookie, while all the elements will be considered when verifying the signature in requests.
    secret: 'e!a@s$yXbVuy#12340976',
    // Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new
    // but not modified. Choosing false is useful for implementing login sessions, reducing server storage usage,
    // or complying with laws that require permission before setting a cookie. Choosing false will also help with
    // race conditions where a client makes multiple parallel requests without a session.
    saveUninitialized: false,
    // Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge,
    // resetting the expiration countdown. The default value is false.
    // Note When this option is set to true but the saveUninitialized option is set to false, the cookie will not
    // be set on a response with an uninitialized session.
    // rolling: true,

    // Forces the session to be saved back to the session store, even if the session was never modified
    // during the request. (for connect configuration, property maxAge below will reflect key's ttl in connect)
    resave: false,
    // The name of the session ID cookie to set in the response (and read from in the request).
    // The default value is 'connect.sid'.
    // Note if you have multiple apps running on the same hostname (this is just the name, i.e. localhost or 127.0.0.1;
    // different schemes and ports do not name a different hostname), then you need to separate the session cookies
    // from each other. The simplest method is to simply set different names per app.
    name: RedisConf.CookiesKey.SESSION_ID,

    // Settings for the session ID cookie. See the "Cookie options" section below for more information
    // on the different values.
    // The default value is { path: '/', httpOnly: true, secure: false, maxAge: null }.
    cookie: {
      // By default cookie.maxAge is null, meaning no "expires" parameter is set so the cookie becomes a
      // browser-session cookie. When the user closes the browser the cookie (and session) will be removed.
      // maxAge: Seconds.HALF_HOURS_SECONDS
      maxAge: null
    }
  }));
  app.use(function (req, res, next) {
    if (!req.session) {
      console.error('Oh no, application can\'t get session info from connect');
      // return next(new Error('Oh no, application can\'t get session info from connect')); // handle error
    }
    next(); // otherwise continue
  });
  console.log('Initializing Session Config...');
}

module.exports = initSession;
