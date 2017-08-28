import extend from 'lodash/extend'

export default (state, emitter) => {
  state.dateSelector = {
    year: 2017,
    month: 7
  }

  state.events = extend(state.events, {
    DATESELECTOR_CHANGE: 'dateSelector:change'
  })

  emitter.on(state.events.DOMCONTENTLOADED, () => {
    emitter.on(state.events.DATESELECTOR_CHANGE, setSelectedDate)
  })

  function setSelectedDate ({ type, value }) {
    state.dateSelector[type] = value
  }
}
