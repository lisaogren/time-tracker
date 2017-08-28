import Promise from 'bluebird'
import log from 'utils/log'

import middlewares from './middlewares'

export default (state, emitter) => {
  log.debug('[services/boot] Initializing boot service')

  emitter.on('DOMContentLoaded', () => {
    runMiddlewares()
  })

  function runMiddlewares () {
    log.debug('[services/boot] Running boot middlewares')

    Promise.mapSeries(middlewares, middleware => Promise.resolve(middleware(state)))
      .then(() => {
        log.debug('[services/boot] Ran all boot middlewares')

        state.app.loading = false

        emitter.emit(state.events.RENDER)
      })
  }
}
