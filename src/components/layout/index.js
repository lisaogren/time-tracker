import html from 'choo/html'

import nav from 'components/nav'
import footer from 'components/footer'
import loading from 'components/loading'

export default (route, page, state, emit) => {
  if (state.app.loading || (route.private && !state.user.data)) {
    if (route.private) {
      emit('replaceState', '/')
    }

    return html`<body></body>`
  }

  return html`
    <body>
      ${nav(state, emit)}
      <main>
       ${page(state, emit)}
      </main>
      ${footer()}
      ${showLoading()}
    </body>
  `

  function showLoading () {
    if (state.app.loading) return loading()
  }
}
