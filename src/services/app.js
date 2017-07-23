import find from 'lodash/find'
import partial from 'lodash/partial'
import forEach from 'lodash/forEach'
import urlComposer from 'url-composer'

import layout from 'components/layout'

import pages from 'pages'

const routes = [
  { path: '/', page: 'main' },
  { path: '/login', page: 'login' },
  { path: '/settings', page: 'settings', private: true },
  { path: '/register', page: 'register', private: true },
  { path: '/profile', page: 'profile', private: true }
]

const appService = {
  init (app) {
    this.app = app

    this.setupRouting()

    this.app.use(middleware)
  },

  setupRouting () {
    forEach(routes, route => {
      this.app.route(route.path, partial(layout, route, pages[route.page]))

      route.active = false
      route.regex = urlComposer.regex(route.path)

      if (isCurrent(route)) route.active = true
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
