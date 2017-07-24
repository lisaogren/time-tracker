import log from 'utils/log'
import runtime from 'serviceworker-webpack-plugin/lib/runtime'

function register () {
  // register sw script in supporting browsers
  if ('serviceWorker' in navigator) {
    runtime.register().then((...args) => {
      log.debug('[service-worker] Registered', args)
    }).catch((err) => {
      log.warn('[service-worker] Failed to register', err)
    })
  }
}

export default {
  register
}
