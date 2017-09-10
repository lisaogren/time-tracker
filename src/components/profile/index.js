import html from 'choo/html'
// import get from 'lodash/get'

export default (state, emit) => {
  return html`
    <section class="section settings-component">
      <div class="container">
        <h1 class="title has-text-centered">
          <span class="icon is-medium">
            <i class="fa fa-user-o"></i>
          </span>
          <span>Profil</span>
        </h1>
        <hr>
      </div>
    </section>
  `
}
