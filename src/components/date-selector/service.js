export default (state, emitter) => {
  state.dateSelector = {
    year: 2017,
    month: 7
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('dateSelector:change', setSelectedDate)
  })

  function setSelectedDate ({ type, value }) {
    state.dateSelector[type] = value
  }
}
