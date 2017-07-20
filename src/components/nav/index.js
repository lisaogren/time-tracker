import html from 'choo/html'

// import gravatar from 'utils/gravatar'

import './index.scss'

export default (state, emit) => {
  return html`
    <nav class="nav has-shadow">
      <div class="container">
        <div class="nav-left">
          <a href="/" class="nav-item">
            <i class="fa fa-clock-o"></i>
            <span>Time Tracker</span>
          </a>
        </div>
        <div class="nav-right">
          <a href="/settings" class="nav-item is-tab">Paramètres</a>
          <a href="/login" class="nav-item is-tab">Connexion</a>
        </div>
      </div>
    </nav>
  `
}

// <a class="nav-item is-tab">
//   <figure class="image is-16x16">
//     <img src="${gravatar.url('rascarlito@gmail.com')}" alt="Profile image" title="">
//   </figure>
//   <span>RasCarlito</span>
// </a>
