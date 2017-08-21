export default (state, emitter) => {
  state.details = {
    month: 7,
    year: 2017
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('details:month', setMonth)
    emitter.on('details:year', setYear)
  })

  function setMonth (month) {
    state.details.month = month

    emitter.emit('render')
  }

  function setYear (year) {
    state.details.year = year

    emitter.emit('render')
  }
}
