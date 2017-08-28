import extend from 'lodash/extend'

export default (state, emitter) => {
  state.events = extend(state.events, {
    DETAILS_SELECTDATE: 'details:select-date'
  })

  emitter.on(state.events.DOMCONTENTLOADED, () => {
    emitter.on(state.events.DETAILS_SELECTDATE, render)
  })

  function render () {
    emitter.emit(state.events.RENDER)
  }
}
