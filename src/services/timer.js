import get from 'lodash/get'
import log from 'utils/log'
import api from 'utils/api'

export default (state, emitter) => {
  state.timer = {
    started: false,
    current: null,
    entries: []
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('timer:start', startTimer)
    emitter.on('timer:stop', stopTimer)
  })

  function startTimer () {
    const now = new Date()

    setCurrent(now)
    addEntry(now).then(() => {
      log.debug('[ timer ] Added time entry', now)
    })
    setStarted()

    log.debug(state.timer)

    emitter.emit('render')
  }

  function stopTimer () {
    const now = new Date()

    addEntry(now).then(() => {
      log.debug('[ timer ] Added time entry', now)
    })
    setStopped()

    log.debug(state.timer)

    emitter.emit('render')
  }

  function setStarted () {
    state.timer.started = true
  }

  function setStopped () {
    state.timer.started = false
  }

  function setCurrent (date) {
    state.timer.current = date
  }

  function addEntry (date) {
    state.timer.entries.push(date)

    const user = get(state.user, 'data.id')

    if (!user) throw new Error('[services/timer] Missing user id')

    const data = { date, user }

    return api.addTimeEntry({ data })
  }
}
