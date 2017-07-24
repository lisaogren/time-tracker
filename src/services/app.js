import html from 'choo/html'
import urlComposer from 'url-composer'
import Promise from 'bluebird'

import find from 'lodash/find'
import partial from 'lodash/partial'
import forEach from 'lodash/forEach'

import log from 'utils/log'

import layout from 'components/layout'

const routes = [
  { path: '/', page: 'main' },
  { path: '/login', page: 'login' },
  { path: '/register', page: 'register' },
  { path: '/settings', page: 'settings', private: true },
  { path: '/profile', page: 'profile', private: true }
]

const appService = {
  init (app) {
    this.app = app

    this.setupRouting()

    this.app.use(partial(middleware, this))
  },

  setupRouting () {
    forEach(routes, route => {
      this.app.route(route.path, this.loadFactory(route, layout))

      route.active = false
      route.regex = urlComposer.regex(route.path)

      if (isCurrent(route)) route.active = true
    })
  },

  pages: {},

  loadPage (name, cb) {
    if (name === 'main') {
      import(/* webpackChunkName: "main" */ 'pages/main').then(module => cb(module))
    }
    else if (name === 'login') {
      import(/* webpackChunkName: "login" */ 'pages/login').then(module => cb(module))
    }
    else if (name === 'register') {
      import(/* webpackChunkName: "register" */ 'pages/register').then(module => cb(module))
    }
    else if (name === 'settings') {
      import(/* webpackChunkName: "settings" */ 'pages/settings').then(module => cb(module))
    }
    else if (name === 'profile') {
      import(/* webpackChunkName: "profile" */ 'pages/profile').then(module => cb(module))
    }
  },

  loadFactory (route, layout) {
    log.debug('[services/app] Generating route callback', route)

    return (...args) => {
      if (!this.pages[route.page]) {
        this.loadPage(route.page, module => {
          this.pages[route.page] = partial(layout, route, module.default)
          this.emitter.emit('render')
        })

        return html`<body></body>`
      }

      return this.pages[route.page](...args)
    }
  }
}

export default appService

// ------------------
// Helpers
// ------------------

function middleware (service, state, emitter) {
  service.emitter = emitter

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
