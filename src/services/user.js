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

  // Wait for DOM before registering emitter events to speed up first paint
  emitter.on('DOMContentLoaded', () => {
    emitter.on('user:login', login)
    emitter.on('user:logout', logout)
    emitter.on('user:register', register)
    emitter.on('user:register:reset', resetRegister)
    emitter.on('user:register:store', storeRegisterValue)
    emitter.on('user:refresh', refreshUser)

    // Fetch current user if any
    getMe().then(user => {
      state.user.data = user

      if (user) emitter.emit('render')
      else emitter.emit('pushState', '/login')
    })
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
      emitter.emit('pushState', '/')

      return getMe().then(user => {
        state.user.data = user
      })
    }

    function error (reason) {
      setLoginError(reason.type || reason.message)
    }
  }

  function logout () {
    api.logout().then(() => {
      state.user = extend({}, defaultState)
      emitter.emit('pushState', '/')
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

    return user
  }

  function render () {
    emitter.emit('render')
  }
}
