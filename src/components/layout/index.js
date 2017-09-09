import html from 'choo/html'

import nav from 'components/nav'
import footer from 'components/footer'
import loading from 'components/loading'

export default (route, page, state, emit) => {
  const isLoading = state.app.loading
  const isRestricted = route.private && !state.user.data && !isLoading

  if (isLoading || isRestricted || !page) {
    if (isRestricted) {
      setTimeout(() => emit(state.events.REPLACESTATE, '/'), 0)
    }

    return html`
      <body>
        ${nav(state, emit)}
        <main></main>
        ${footer()}
        ${showLoading()}
      </body>
    `
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
