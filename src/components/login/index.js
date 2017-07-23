import html from 'choo/html'
import log from 'utils/log'
import serialize from 'utils/form-serialize'

import passwordInput from 'components/password-input'
import technicalError from 'components/technical-error'

import './index.scss'

export default (state, emit) => {
  return html`
    <section class="section login-component">
      <div class="container">
        <h1 class="title has-text-centered">Connectes-toi à ton compte !</h1>
        <hr>
        <form class="login" onsubmit=${submitLogin}>
          <div class="columns">
            <div class="column is-one-third-desktop is-offset-4-desktop is-half-tablet is-offset-3-tablet">
              ${loginError()}
              <div class="field">
                <label class="label">Nom d'utilisateur ou e-mail</label>
                <div class="control">
                  <input type="text" name="identifier" class="input" placeholder="jeanmichel@peupres.fr" required />
                </div>
              </div>
              ${passwordInput()}
              <div class="field">
                <div class="control actions">
                  ${submitButton()}
                </div>
              </div>
            </div>
          </div>
        </form>
        <hr>
        <div class="content has-text-centered">
          <h3>Pas de compte encore ?</h3>
          <p>
            Pas de problème !
            <a href="/register">Créer ton compte en quelques secondes ici</a>
          </p>
        </div>
      </div>
    </section>
  `

  // ----------------------
  // Sub-components
  // ----------------------

  function submitButton () {
    const isConnecting = state.user.login.connecting

    if (isConnecting) {
      return html`<button class="button is-primary" disalbed="true">Connexion en cours ...</button>`
    }

    return html`<button class="button is-primary">Se connecter</button>`
  }

  function loginError () {
    if (state.user.login.error) {
      const message = state.user.login.error === 'functional'
        ? html`<span>Connection impossible...<br>T'as dû te tromper d'identiant</span>`
        : technicalError()

      return html`
        <div class="notification is-warning login-error">
          ${message}
        </div>
      `
    }
  }

  // ----------------------
  // Listeners
  // ----------------------

  function submitLogin (e) {
    e.preventDefault()

    const data = serialize(e.currentTarget)

    // Validate data locally

    log.debug('[components/login] Submitted login form:', data)

    emit('user:login', data)
  }
}
