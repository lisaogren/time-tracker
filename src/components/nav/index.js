import $ from 'dominus'
import html from 'choo/html'

import noop from 'lodash/noop'

// import gravatar from 'utils/gravatar'

import './index.scss'

export default (state, emit) => {
  return html`
    <nav class="navbar nav-component">
      <div class="navbar-brand">
        ${navItem({ label: 'Time Tracker', icon: 'clock-o', href: '/' })}
        <div class="navbar-burger burger" data-target="#time-tracker-nav" onclick=${toggle}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div id="time-tracker-nav" class="navbar-menu">
        <div class="navbar-end">
          ${userNav()}
        </div>
      </div>
    </nav>
  `

  function userNav () {
    const user = state.user.data

    if (user) {
      return html`
        <a class="navbar-item has-dropdown is-hoverable user-nav">
          <a href="/profile" class="navbar-link">
            <div class="field is-grouped">
              <figure class="image is-16x16">
                <img src="${user.gravatarUrl}" alt="Profile image" title="">
              </figure>
              <span>${user.username}</span>
            </div>
          </div>

          <div class="navbar-dropdown">
            ${navItem({ label: 'Paramètres', icon: 'cog', href: '/settings' })}
            <hr class="navbar-divider">
            ${navItem({ label: 'Déconnexion', icon: 'sign-out', onclick: logout })}
          </div>
        </a>
      `
    }

    return navItem({ label: 'Connexion', icon: 'sign-in', href: '/login' })
  }

  function navItem (options = {}) {
    const { onclick = noop, label = '', href = '' } = options

    return html`
      <a href="${href}" class="navbar-item" onclick=${onclick}>
        ${options.icon ? icon(options.icon) : ''}
        <span>${label}</span>
      </a>
    `
  }

  function icon (name) {
    return html`
      <span class="icon is-small">
        <i class="fa fa-${name}"></i>
      </span>
    `
  }

  function toggle (e) {
    const $el = $(e.currentTarget)
    const method = $el.hasClass('is-active') ? 'removeClass' : 'addClass'

    $el[method]('is-active')
    $($el.attr('data-target'))[method]('is-active')
  }

  function logout (e) {
    e.preventDefault()
    emit('user:logout')
  }
}
