import find from 'lodash/find'
import forEach from 'lodash/forEach'
import urlComposer from 'url-composer'

import pages from 'pages'

const routes = [
  { path: '/', page: 'main' },
  { path: '/settings', page: 'settings' },
  { path: '/login', page: 'login' },
  { path: '/register', page: 'register' },
  { path: '/profile', page: 'profile' }
]

const appService = {
  init (app) {
    this.app = app

    this.setupRouting()

    this.app.use(middleware)
  },

  setupRouting () {
    forEach(routes, route => {
      this.app.route(route.path, pages[route.page])
    })
  }
}

export default appService

// ------------------
// Helpers
// ------------------

function middleware (state, emitter) {
  state.app = {
    loading: true
  }

  state.routes = {
    list: routes
  }

  forEach(routes, route => {
    route.active = false
    route.regex = urlComposer.regex(route.path)

    if (isCurrent(route)) route.active = true
  })

  emitter.on('DOMContentLoaded', () => {
    emitter.on('pushState', () => pushState)
  })

  function pushState () {
    forEach(routes, item => { item.active = false })

    const route = find(routes, route => isCurrent(route))

    if (route) {
      route.active = true

      emitter.emit('render')
    }
  }
}

function isCurrent (route) {
  return route.regex.test(window.location.pathname)
}
