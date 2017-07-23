import html from 'choo/html'

import nav from 'components/nav'
import footer from 'components/footer'
import settings from 'components/settings'

export default (state, emit) => {
  return html`
    <body>
      ${nav(state, emit)}
      <main>
        ${settings(state, emit)}
      </main>
      ${footer()}
    </body>
  `
}
