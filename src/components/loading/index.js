import html from 'choo/html'

import './index.scss'

export default (state, emit) => {
  return html`
    <div class="is-overlay loading-component">
      <div class="modal-background"></div>
      <h1 class="title loading-message">Chargement...</h1>
    </div>
  `
}
