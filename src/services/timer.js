import get from 'lodash/get'
import extend from 'lodash/extend'

import log from 'utils/log'
import api from 'utils/api'

export default (state, emitter) => {
  state.timer = {
    started: false,
    current: null,
    entries: []
  }

  state.events = extend(state.events, {
    TIMER_START: 'timer:start',
    TIMER_STOP: 'timer:stop',
    TIMER_SET_CURRENT: 'timer:setCurrent'
  })

  emitter.on('DOMContentLoaded', () => {
    emitter.on(state.events.TIMER_START, startTimer)
    emitter.on(state.events.TIMER_STOP, stopTimer)
    emitter.on(state.events.TIMER_SET_CURRENT, setCurrentData)
  })

  function startTimer () {
    const now = new Date()

    setCurrent(now)
    setStarted()
    addEntry(now).then(() => {
      log.debug('[services/timer] Added time entry', now)
      log.debug(state.timer)

      emitter.emit(state.events.RENDER)
    })
  }

  function stopTimer () {
    const now = new Date()

    setCurrent(now)
    setStopped()
    addEntry(now).then(() => {
      log.debug('[services/timer] Added time entry', now)
      log.debug(state.timer)

      emitter.emit(state.events.RENDER)
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
