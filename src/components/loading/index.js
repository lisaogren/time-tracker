import $ from 'dominus'
import html from 'choo/html'

import './index.scss'

let timer

export default (state, emit) => {
  if (timer) clearTimeout(timer)

  timer = setTimeout(showLoading, 1000)

  return html`
    <div class="is-overlay loading-component">
      <div class="modal-background"></div>
      <h1 class="title loading-message">Chargement...</h1>
    </div>
  `

  function showLoading () {
    const $el = $('.loading-component')

    if ($el.length) {
      $el.addClass('animated fadeIn')
    }
  }
}
