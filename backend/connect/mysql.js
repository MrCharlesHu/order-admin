const MySQLConn = require('./../config').MySQLConn;

/**
 * The client created by the configuration initializes a connection pool, using the Pool2 library.
 * This connection pool has a default setting of a min: 2, max: 10 for the MySQL and PG libraries,
 * and a single connection for sqlite3 (due to issues with utilizing multiple connections on a single file).
 * To change the config settings for the pool, pass a pool option as one of the keys in the initialize block.
 *
 * The default connection pool also applies a ping function to verify that a connection is still alive
 * by running a SELECT 1 query. If you don't want this check you may supply your own ping function to
 * overwrite knex's default behavior.
 */
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: MySQLConn.host,
    user: MySQLConn.user,
    password: MySQLConn.password,
    database: MySQLConn.database
  },
  pool: {
    min: 10,
    max: 100
  }
});

exports.knex = knex;
