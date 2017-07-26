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
    emitter.on('timer:setCurrentData', setCurrentData)
  })

  function startTimer () {
    const now = new Date()

    setCurrent(now)
    setStarted()
    addEntry(now).then(() => {
      log.debug('[services/timer] Added time entry', now)
      log.debug(state.timer)

      emitter.emit('render')
    })
  }

  function stopTimer () {
    const now = new Date()

    setCurrent(now)
    setStopped()
    addEntry(now).then(() => {
      log.debug('[services/timer] Added time entry', now)
      log.debug(state.timer)

      emitter.emit('render')
    })
  }

  function setCurrentData () {
    const user = get(state.user, 'data')

    state.timer.entries = user.timeEntries
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
    const user = get(state.user, 'data.id')

    if (!user) throw new Error('[services/timer] Missing user id')

    const data = { date, user }

    return api.addEntry({ data }).then(res => {
      state.timer.entries.push(res.body)

      return res.body
    })
  }
}
