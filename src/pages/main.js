import html from 'choo/html'

import nav from 'components/nav'
import footer from 'components/footer'

export default (state, emit) => {
  const { timer } = state

  return html`
    <body>
      ${nav(state, emit)}
      <main>
        <section class="section">
          <div class="container">
            ${btn()}
          </div>
        </section>
      </main>
      ${footer()}
    </body>
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
