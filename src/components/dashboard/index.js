import html from 'choo/html'

export default (state, emit) => {
  const { timer } = state

  return html`
    <section class="section">
      <div class="container">
        <h1 class="title">Tableau de bord</h1>
        <hr>
        ${btn()}
      </div>
    </section>
  `

  function btn () {
    return html`
      <button class="button is-${timer.started ? 'danger' : 'primary'}" onclick=${toggle}>
        <i class="fa fa-${timer.started ? 'stop' : 'play'}"></i>
        <span>${timer.started ? 'Stop' : 'Start'}</span>
      </button>
    `
  }

  function toggle () {
    if (timer.started) emit('timer:stop')
    else emit('timer:start')
  }
}
