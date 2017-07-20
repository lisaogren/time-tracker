import log from 'utils/log'
import api from 'utils/api'

export default {
  init (app) {
    app.use(middleware)
  }
}

function middleware (state, emitter) {
  state.timer = {
    started: false,
    current: null,
    entries: []
  }

  emitter.on('timer:start', () => {
    const now = new Date()

    setCurrent(now)
    addEntry(now).then(() => {
      log.debug('[ timer ] Added time entry', now)
    })
    start()

    log.debug(state.timer)

    emitter.emit('render')
  })

  emitter.on('timer:stop', () => {
    const now = new Date()

    addEntry(now).then(() => {
      log.debug('[ timer ] Added time entry', now)
    })
    stop()

    log.debug(state.timer)

    emitter.emit('render')
  })

  function start () {
    state.timer.started = true
  }

  function stop () {
    state.timer.started = false
  }

  function setCurrent (date) {
    state.timer.current = date
  }

  function addEntry (date) {
    state.timer.entries.push(date)

    const data = {
      date,
      user: 1
    }

    return api.addTimeEntry({ data })
  }
}
