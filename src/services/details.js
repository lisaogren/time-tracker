import Promise from 'bluebird'

import get from 'lodash/get'
import map from 'lodash/map'
import extend from 'lodash/extend'
import concat from 'lodash/concat'

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
    DETAILS_CLOSE: 'details:close'
  })

  emitter.on(state.events.DOMCONTENTLOADED, () => {
    emitter.on(state.events.DETAILS_SELECTDATE, render)
    emitter.on(state.events.DETAILS_EDIT, edit)
    emitter.on(state.events.DETAILS_ADD, add)
    emitter.on(state.events.DETAILS_SAVE, save)
    emitter.on(state.events.DETAILS_CLOSE, close)
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

  function close () {
    clear()
    render()
  }

  function clear () {
    state.details.add = null
    state.details.edit = null
  }

  function render () {
    emitter.emit(state.events.RENDER)
  }
}
