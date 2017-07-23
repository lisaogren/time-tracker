import html from 'choo/html'

import nav from 'components/nav'
import footer from 'components/footer'
import profile from 'components/profile'

export default (state, emit) => {
  return html`
    <body>
      ${nav(state, emit)}
      <main>
        ${profile(state, emit)}
      </main>
      ${footer()}
    </body>
  `
}
