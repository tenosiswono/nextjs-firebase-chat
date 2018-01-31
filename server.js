const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const admin = require('firebase-admin')
const { join } = require('path')
const { parse } = require('url')
const log = require('loglevel')
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const app = next({ dev })
const handle = app.getRequestHandler()
log.setLevel(dev ? 'info' : 'error')
const firebase = admin.initializeApp({
  credential: admin.credential.cert(require('./credentials/server')),
  databaseURL: 'https://amar-chat.firebaseio.com'
}, 'server')
app.prepare()
  .then(() => {
    const server = express()
    server.use(bodyParser.json())
    server.use(session({
      secret: 'nextjs-firebase-chat',
      saveUninitialized: true,
      store: new FileStore({path: '/tmp/sessions', secret: 'nextjs-firebase-chat'}),
      resave: false,
      rolling: true,
      httpOnly: true,
      cookie: { maxAge: 604800000 } // week
    }))
    server.use((req, res, next) => {
      req.firebaseServer = firebase
      next()
    })
    server.get('/firebase-messaging-sw.js', (req, res) => {
      app.serveStatic(req, res, 'static/firebase-messaging-sw.js')
    })
    server.post('/api/login', (req, res) => {
      if (!req.body) return res.sendStatus(400)
      const token = req.body.token
      firebase.auth().verifyIdToken(token)
        .then((decodedToken) => {
          req.session.decodedToken = decodedToken
          return decodedToken
        })
        .then((decodedToken) => res.json({ status: true, decodedToken }))
        .catch((error) => res.json({ error }))
    })
    server.post('/api/logout', (req, res) => {
      req.session.decodedToken = null
      res.json({ status: true })
    })
    server.get('/service-worker.js', (req, res) => {
      const parsedUrl = parse(req.url, true)
      const { pathname } = parsedUrl
      const filePath = join(__dirname, '.next', pathname)
      app.serveStatic(req, res, filePath)
    })
    server.get('*', (req, res) => handle(req, res))
    server.listen(port, (err) => {
      if (err) {
        log.error(err)
        throw err
      }
      log.info(`> Ready on http://localhost:${port}`)
    })
  })
  .catch((ex) => {
    log.error(ex.stack)
    process.exit(1)
  })
