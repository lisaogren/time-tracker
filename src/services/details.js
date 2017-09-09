import Promise from 'bluebird'

import get from 'lodash/get'
import extend from 'lodash/extend'
import filter from 'lodash/filter'

import isSameDay from 'date-fns/is_same_day'
import setHours from 'date-fns/set_hours'
import setMinutes from 'date-fns/set_minutes'

import api from 'utils/api'

export default (state, emitter) => {
  state.details = {
    edit: null,
    add: null
  }

  state.events = extend(state.events, {
    DETAILS_SELECTDATE: 'details:select-date',
    DETAILS_EDIT: 'details:edit',
    DETAILS_ADD: 'details:add',
    DETAILS_SAVE: 'details:save',
    DETAILS_DELETE: 'details:delete',
    DETAILS_CLOSE: 'details:close',
    DETAILS_CLEAR_DAY: 'details:clear-day',
    DETAILS_SET_NORMAL_WORK_TIME: 'details:set-normal-work-time'
  })

  emitter.on(state.events.DOMCONTENTLOADED, () => {
    emitter.on(state.events.DETAILS_SELECTDATE, render)
    emitter.on(state.events.DETAILS_EDIT, edit)
    emitter.on(state.events.DETAILS_ADD, add)
    emitter.on(state.events.DETAILS_SAVE, save)
    emitter.on(state.events.DETAILS_DELETE, del)
    emitter.on(state.events.DETAILS_CLOSE, close)
    emitter.on(state.events.DETAILS_CLEAR_DAY, clearDay)
    emitter.on(state.events.DETAILS_SET_NORMAL_WORK_TIME, setNormalWorkTime)
  })

  function add ({ date }) {
    clear()
    state.details.add = { date }
    render()
  }

  function edit ({ date, startId, endId }) {
    clear()
    state.details.edit = { date, startId, endId }
    render()
  }

  function save ({ edit, start, end }) {
    const user = get(state.user, 'data.id')

    if (!edit) {
      Promise.all([
        api.addEntry({ data: { user, date: start.date } }),
        api.addEntry({ data: { user, date: end.date } })
      ]).then(newEntries => {
        clear()
        emitter.emit(state.events.USER_REFRESH)
      })

      return
    }

    Promise.all([
      api.updateEntry({ params: { id: start.id }, data: { date: start.date } }),
      api.updateEntry({ params: { id: end.id }, data: { date: end.date } })
    ]).then(updatedEntries => {
      clear()
      emitter.emit(state.events.USER_REFRESH)
    })
  }

  function del ({ entries }) {
    return Promise.map(entries, id => api.deleteEntry({ params: { id } }))
      .then(clear)
      .then(() => emitter.emit(state.events.USER_REFRESH))
  }

  function close () {
    clear()
    render()
  }

  function clear () {
    state.details.add = null
    state.details.edit = null
  }

  function deleteEntries (date) {
    const entries = filter(state.timer.entries, entry => isSameDay(entry.date, date))

    return Promise.map(entries, entry => api.deleteEntry({ params: { id: entry.id } }))
  }

  function clearDay (date) {
    return deleteEntries(date).then(() => emitter.emit(state.events.USER_REFRESH))
  }

  function setNormalWorkTime (date) {
    deleteEntries(date).then(() => {
      const entries = [
        setMinutes(setHours(date, 8), 30),
        setMinutes(setHours(date, 12), 0),
        setMinutes(setHours(date, 13), 0),
        setMinutes(setHours(date, 17), 0)
      ]
      const user = get(state.user, 'data.id')

      Promise.map(entries, date => api.addEntry({ data: { user, date } }))
        .then(() => {
          emitter.emit(state.events.USER_REFRESH)
        })
    })
  }

  function render () {
    emitter.emit(state.events.RENDER)
  }
}
