import html from 'choo/html'
import get from 'lodash/get'

export default (state, emit) => {
  const user = get(state.user, 'data', {})

  return html`
    <section class="section settings-component">
      <div class="container">
        <h1 class="title">Modifier le profil de ${user.username}</h1>
        <hr>
      </div>
    </section>
  `
}
