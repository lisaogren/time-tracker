import html from 'choo/html'

import nav from 'components/nav'
import footer from 'components/footer'
import login from 'components/login'

export default (state, emit) => {
  return html`
    <body>
      ${nav(state, emit)}
      <main>
        ${login(state, emit)}
      </main>
      ${footer()}
    </body>
  `
}
