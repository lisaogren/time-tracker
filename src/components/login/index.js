import html from 'choo/html'

import './index.scss'

export default (state, emit) => {
  return html`
    <section class="section login-component">
      <div class="container">
        <h1 class="title has-text-centered">Connectes-toi à ton compte !</h1>
        <hr>
        <form class="login">
          <div class="columns">
            <div class="column is-one-third-desktop is-offset-4-desktop is-half-tablet is-offset-3-tablet">
              <div class="field">
                <label class="label">E-mail</label>
                <div class="control">
                  <input type="text" name="identifier" class="input" placeholder="jeanmichel@peupres.fr" />
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
                  <button class="button is-primary">Connexion</button>
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
}
