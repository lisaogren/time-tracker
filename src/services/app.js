import html from 'choo/html'
import urlComposer from 'url-composer'

import find from 'lodash/find'
import partial from 'lodash/partial'
import forEach from 'lodash/forEach'

import loadPage from './pages'

import log from 'utils/log'

import layout from 'components/layout'

const routes = [
  { path: '/', page: 'main' },
  { path: '/login', page: 'login' },
  { path: '/register', page: 'register' },
  { path: '/settings', page: 'settings', private: true },
  { path: '/profile', page: 'profile', private: true },
  { path: '/details', page: 'details', private: true }
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

  loadFactory (route, layout) {
    log.debug('[services/app] Generating route callback', route)

    return (...args) => {
      if (!this.pages[route.page]) {
        loadPage(route.page, module => {
          this.pages[route.page] = partial(layout, route, module.default)
          this.emitter.emit('render')
        })

        return layout(route, null, ...args)
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
    loading: true,
    current: null
  }

  state.routes = {
    list: routes
  }

  setCurrent()

  emitter.on(state.events.DOMCONTENTLOADED, () => {
    emitter.on(state.events.PUSHSTATE, setCurrent)
  })

  function setCurrent () {
    forEach(routes, item => { item.active = false })
    const route = find(routes, route => isCurrent(route))

    if (route) {
      route.active = true
      state.app.current = route.page
    }
  }
}

function isCurrent (route) {
  return route.regex.test(window.location.pathname)
}
