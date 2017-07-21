import $ from 'dominus'
import html from 'choo/html'

// import gravatar from 'utils/gravatar'

import './index.scss'

export default (state, emit) => {
  return html`
    <nav class="navbar nav-component">
      <div class="navbar-brand">
        <a href="/" class="navbar-item">
          <i class="fa fa-clock-o"></i>
          <span>Time Tracker</span>
        </a>
        <div class="navbar-burger burger" data-target="#time-tracker-nav" onclick=${toggle}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div id="time-tracker-nav" class="navbar-menu">
        <div class="navbar-end">
          <a href="/settings" class="navbar-item is-tab">Paramètres</a>
          ${userNav()}
        </div>
      </div>
    </nav>
  `

  function userNav () {
    const user = state.user.data

    if (user) {
      return html`
        <a class="navbar-item is-tab">
          <figure class="image is-16x16">
            <img src="${user.gravatarUrl}" alt="Profile image" title="">
          </figure>
          <span>${user.username}</span>
        </a>
      `
    }

    return html`
      <a href="/login" class="navbar-item is-tab">Connexion</a>
    `
  }

  function toggle (e) {
    const $el = $(e.currentTarget)
    const method = $el.hasClass('is-active') ? 'removeClass' : 'addClass'

    $el[method]('is-active')
    $($el.attr('data-target'))[method]('is-active')
  }
}
