import log from 'utils/log'
import api from 'utils/api'

export default (state) => {
  log.debug('[services/boot] Running "user" middleware')

  // Fetch current user if any
  return api.me().then(res => {
    log.debug(res.body)
    state.user.data = res.body
  })
}
