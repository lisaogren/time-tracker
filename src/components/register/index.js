import html from 'choo/html'

import './index.scss'

export default (state, emit) => {
  return html`
    <section class="section register-component">
      <div class="container">
        <h1 class="title has-text-centered">Créer ton compte !</h1>
        <hr>
        <form class="register">
          <div class="columns">
            <div class="column is-one-third-desktop is-offset-4-desktop is-half-tablet is-offset-3-tablet">
              <div class="field">
                <label class="label">Nom d'utilisateur</label>
                <div class="control">
                  <input type="text" name="username" class="input" placeholder="Jean-Michel" />
                </div>
              </div>
              <div class="field">
                <label class="label">E-mail</label>
                <div class="control">
                  <input type="text" name="email" class="input" placeholder="jean@michel.fr" />
                </div>
              </div>
              <div class="field">
                <label class="label">Mot de passe</label>
                <div class="control">
                  <input type="text" name="password" class="input" placeholder="1 m0t D3 PaSs3 Tr3s C0mpL!qu3" />
                </div>
              </div>
              <div class="field">
                <div class="control actions">
                  <button class="button is-primary">Créer</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  `
}
