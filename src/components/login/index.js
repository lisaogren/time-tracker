import html from 'choo/html'
import log from 'utils/log'
import serialize from 'utils/form-serialize'

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
                <label class="label">E-mail</label>
                <div class="control">
                  <input type="text" name="identifier" class="input" placeholder="jeanmichel@peupres.fr" />
                </div>
              </div>
              <div class="field">
                <label class="label">Mot de passe</label>
                <div class="control">
                  <input type="password" name="password" class="input" placeholder="1 m0t D3 PaSs3 Tr3s C0mpL!qu3" />
                </div>
              </div>
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

  function submitLogin (e) {
    e.preventDefault()

    const data = serialize(e.currentTarget)

    // Validate data locally

    log.debug('[components/login] Submitted login form:', data)

    emit('user:login', data)
  }

  function submitButton () {
    const isConnecting = state.user.login.connecting

    return html`
      <button class="button is-primary" ${isConnecting ? 'disabled="true"' : ''}>
        Connexion ${isConnecting ? 'en cours ...' : ''}
      </button>
    `
  }

  function loginError () {
    if (state.user.login.error) {
      const message = state.user.login.error === 'functional'
        ? html`<span>Connection impossible...<br>T'as dû te tromper d'identiant</span>`
        : html`<span>Une erreur technique est survenu...<br>Déso quoi :(</span>`

      return html`
        <div class="notification is-warning login-error">
          ${message}
        </div>
      `
    }
  }
}
