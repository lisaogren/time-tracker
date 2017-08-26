export default (state, emitter) => {
  emitter.on('DOMContentLoaded', () => {
    emitter.on('details:select-date', render)
  })

  function render () {
    emitter.emit('render')
  }
}
