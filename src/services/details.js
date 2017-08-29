import extend from 'lodash/extend'

export default (state, emitter) => {
  state.details = {
    edit: null,
    add: null
  }

  state.events = extend(state.events, {
    DETAILS_SELECTDATE: 'details:select-date',
    DETAILS_EDIT: 'details:edit',
    DETAILS_ADD: 'details:add',
    DETAILS_CLOSE: 'details:close'
  })

  emitter.on(state.events.DOMCONTENTLOADED, () => {
    emitter.on(state.events.DETAILS_SELECTDATE, render)
    emitter.on(state.events.DETAILS_EDIT, edit)
    emitter.on(state.events.DETAILS_ADD, add)
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
