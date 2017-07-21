import html from 'choo/html'

import nav from 'components/nav'
import footer from 'components/footer'
import register from 'components/register'

export default (state, emit) => {
  return html`
    <body>
      ${nav(state, emit)}
      <main>
        ${register(state, emit)}
      </main>
      ${footer()}
    </body>
  `
}
