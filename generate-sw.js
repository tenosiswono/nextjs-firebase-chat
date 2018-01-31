const fs = require('fs')
const path = require('path')
const loadJsonFile = require('load-json-file')

const dotNext = path.resolve(__dirname, './.next')
const target = path.resolve(__dirname, './.next/service-worker.js')

function bundles (app) {
  return new Promise((resolve, reject) => {
    fs.readdir(`${dotNext}/bundles/pages`, (err, files) => {
      if (err) {
        resolve(app)
      }

      if (files) {
        const root = `/_next/${app.buildId}/page`
        app.precaches = app.precaches.concat(files
          .filter(file => file !== 'index.js' && file !== '_document.js')
          .map(file => {
            // req /_next/22321e97-8895-48db-b915-82e255f3faa8/new
            return path.join(root, file.replace(/.js$/, ''))
          })
        )
      }

      resolve(app)
    })
  })
}

function chunks (app) {
  return new Promise((resolve, reject) => {
    fs.readdir(`${dotNext}/chunks`, (err, files) => {
      if (err) {
        resolve(app)
      }

      if (files) {
        const root = `/_next/webpack/chunks`
        app.precaches = app.precaches.concat(files
          .filter(file => /\.js$/.test(file))
          .map(file => {
            return path.join(root, file)
          })
        )
      }

      resolve(app)
    })
  })
}

function app () {
  const app = {
    buildId: fs.readFileSync(`${dotNext}/BUILD_ID`, 'utf8'),
    precaches: []
  }

  return loadJsonFile(`${dotNext}/build-stats.json`).then(stats => {
    Object.keys(stats).map(src => {
      app.precaches.push(`/_next/${stats[src].hash}/${src}`)
    })

    return app
  })
}

const swSnippet = (precache) =>
  `importScripts('https://unpkg.com/workbox-sw@2.1.2/build/importScripts/workbox-sw.prod.v2.1.2.js')
const workboxSW = new WorkboxSW({clientsClaim: true})
// set precahe listed item
workboxSW.precache(${precache})
// cache very first page by sw
workboxSW.router.registerRoute(
  '/',
  workboxSW.strategies.staleWhileRevalidate()
)
workboxSW.router.registerRoute(
  /(.*)\\/static\\/(.*)/,
  workboxSW.strategies.cacheFirst({
    cacheName: 'images',
    cacheExpiration: {
      maxEntries: 10,
      maxAgeSeconds: 7 * 24 * 60 * 60,
    },
    cacheableResponse: {statuses: [0, 200]},
  })
)
`

app()
  .then(chunks)
  .then(bundles)
  .then(app => {
    fs.writeFileSync(target,
      swSnippet(JSON.stringify(app.precaches, null, 2)),
      'utf8'
    )
  })
