import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import extend from 'lodash/extend'
import partial from 'lodash/partial'

import api from 'utils/api'
import log from 'utils/log'

const defaultState = {
  login: {
    connecting: false,
    error: null
  },
  register: {
    success: false,
    username: null,
    error: null,
    invalidAttributes: {},
    data: {}
  },
  data: null
}

export default (state, emitter) => {
  // Initialise user state
  if (!state.user) {
    state.user = extend({}, defaultState)
  }

  state.events = extend(state.events, {
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_REGISTER: 'user:register',
    USER_REGISTER_RESET: 'user:register:reset',
    USER_REGISTER_STORE: 'user:register:store',
    USER_REFRESH: 'user:refresh'
  })

  // Wait for DOM before registering emitter events to speed up first paint
  emitter.on(state.events.DOMCONTENTLOADED, () => {
    emitter.on(state.events.USER_LOGIN, login)
    emitter.on(state.events.USER_LOGOUT, logout)
    emitter.on(state.events.USER_REGISTER, register)
    emitter.on(state.events.USER_REGISTER_RESET, resetRegister)
    emitter.on(state.events.USER_REGISTER_STORE, storeRegisterValue)
    emitter.on(state.events.USER_REFRESH, refreshUser)
  })

  // ----------------------
  // Listeners
  // ----------------------

  function login (data) {
    setConnecting(true)
    render()

    api.login({ data })
      .then(success, error)
      .then(partial(setConnecting, false))
      .then(render)

    function success (response) {
      if (response.error) return error(response)

      resetLoginError()

      return getMe().then(user => {
        state.user.data = user
        state.timer.entries = user.timeEntries

        emitter.emit(state.events.PUSHSTATE, '/')
      })
    }

    function error (reason) {
      setLoginError(reason.type || reason.message)
    }
  }

  function logout () {
    api.logout().then(() => {
      state.user = extend({}, defaultState)

      emitter.emit(state.events.PUSHSTATE, '/')
    })
  }

  function register (data) {
    api.register({ data })
      .then(success, error)
      .then(render)

    function success (response) {
      if (response.error) return error(response)

      state.user.register.success = true
      state.user.register.username = response.body.username

      resetRegisterError()
    }

    function error (response) {
      log.debug('[services/user] Register error', response)

      setRegisterError(response.type)

      const reason = response.xhr.body

      if (reason.code === 'E_VALIDATION') {
        state.user.register.invalidAttributes = reason.invalidAttributes
      }
    }
  }

  function storeRegisterValue (data) {
    state.user.register.data[data.field] = data.value
  }

  function refreshUser () {
    return getMe().then(storeUser).then(render)
  }

  // ----------------------
  // Helpers
  // ----------------------

  function resetRegister () {
    state.user.register.success = false
    state.user.register.username = null
    state.user.register.data = {}

    resetRegisterError()
  }

  function resetRegisterError () {
    state.user.register.error = null
    state.user.register.invalidAttributes = {}
  }

  function setRegisterError (reason) {
    state.user.register.error = reason
  }

  function resetLoginError () {
    state.user.login.error = null
  }

  function setLoginError (reason) {
    state.user.login.error = reason
  }

  function setConnecting (connecting) {
    state.user.login.connecting = connecting
  }

  function getMe () {
    return api.me().then(res => {
      log.debug('[services/user] /users/me :', res.body)

      return res.body
    })
  }

  function storeUser (user) {
    state.user.data = user

    // Extract entries data from user
    const entries = get(state.user, 'data.timeEntries', [])

    // Store entries
    state.timer.entries = sortBy(entries, 'date')

    return user
  }

  function render () {
    emitter.emit(state.events.RENDER)
  }
}
