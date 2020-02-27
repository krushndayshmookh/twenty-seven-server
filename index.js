const express = require('express')
const fs = require('fs')
const cors = require('cors')
const bodyParser = require('body-parser')
const session = require('express-session')

const PORT = process.env.PORT
const SESSION_SECRET = process.env.SESSION_SECRET

let app = express()

const http = require('http').createServer(app)
const io = require('socket.io')(http)

const eventController = require('./controllers/eventController')(io)

if (process.env.NODE_ENV == 'development') {
  const logger = require('morgan')
  app.use(logger('dev'))
}

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static('dist'))

app.use('/data', express.static('data'))

app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
  })
)

app.use('/api', require('./router'))

app.use(function(req, res) {
  res.status(404)
  if (req.accepts('json')) return res.send({ error: 'Not found' })
  return res.type('txt').send('Not found')
})

// Generate directories

let req_dirs = ['/data']
console.info('Creating required directories...')
req_dirs.forEach(reqdir => {
  if (!fs.existsSync(__dirname + reqdir))
    fs.mkdirSync(__dirname + reqdir, { recursive: true })
})
console.info('Created required directories.')

// Start server

http.listen(PORT, err => {
  if (err) throw err
  console.info('Listening on port ' + PORT + '...')
})
