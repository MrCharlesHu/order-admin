const app_start_ms = Date.now()
require('./check-versions')()
const config = require('../config')
var express = require('express')
var http = require('http')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var compress = require('compression')
var xmlparser = require('express-xml-bodyparser')

var app = express()

app.use(compress())
app.use(logger('dev'))
app.use(bodyParser.json({limit: 1024 * 1024 * 10, type: 'application/json'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(xmlparser())
app.enable('trust proxy')

app.use('/api/user', require('../backend/router/user'))
app.use('/api/order', require('../backend/router/order'))
app.use('/api/log', require('../backend/router/log'))

// serve pure static assets
// const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
// app.use(staticPath, express.static('./static'))
app.use(express.static(path.resolve(__dirname, '../dist')))

app.use(function (req, res, next) {
  // var err = new Error('Not Found')
  // err.status = 404
  console.error(`Request Not Found [${req.path}]`);
  next()
})

var port = normalizePort(process.env.PORT || config.dev.port)
app.set('port', port)
var server = http.createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)
console.log(`Application Started >>> Cost【 ${Date.now() - app_start_ms} 】milliseconds...`)

function normalizePort(val) {
  var port = parseInt(val, 10)
  if (isNaN(port)) {
    // named pipe
    return val
  }
  if (port >= 0) {
    // port number
    return port
  }
  return false
}
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}
function onListening() {
  var addr = server.address()
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'http://localhost:' + addr.port
  console.info('Listening on ' + bind)
}