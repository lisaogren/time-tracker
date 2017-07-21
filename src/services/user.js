import partial from 'lodash/partial'

import api from 'utils/api'
import log from 'utils/log'

export default (state, emitter) => {
  // Initialise user state
  if (!state.user) {
    state.user = {
      login: {
        connecting: false,
        error: null
      },
      data: null
    }
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('user:login', login)
    emitter.on('user:register', register)
    emitter.on('user:disconnect', disconnect)

    getMe().then(user => {
      state.user.data = user
      emitter.emit('render')
    })
  })

  function login (data) {
    setConnecting(true)

    api.login({ data })
      .then(success, error)
      .then(partial(setConnecting, false))
      .then(render)

    function success (response) {
      resetLoginError()
      emitter.emit('pushState', '/')

      return getMe().then(user => {
        state.user.data = user
      })
    }

    function error (err) {
      setLoginError(err.message)
    }
  }

  function disconnect () {

  }

  function register () {

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

  function render () {
    emitter.emit('render')
  }
}
