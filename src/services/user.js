import api from 'utils/api'
import log from 'utils/log'

export default (state, emitter) => {
  // Initialise user state
  if (!state.user) {
    state.user = {
      connected: false
    }
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('user:connect', connect)
    emitter.on('user:register', register)
    emitter.on('user:disconnect', disconnect)
  })

  function connect () {

  }

  function disconnect () {

  }

  function register () {

  }

  api.me().then(res => {
    log.debug('[services/user] /users/me :', res)
  })
}
