import html from 'choo/html'

import nav from 'components/nav'
import footer from 'components/footer'

export default (state, emit) => {
  return html`
    <body>
      ${nav(state, emit)}
      <main>
        <section class="section">
          <div class="container">
            <h1 class="title">Paramètres</h1>
            <hr>
            <form>
              <div class="field">
                <label class="label">Durée d'une journée de travail</label>
                <div class="control">
                  <input type="text" name="day" class="input" placeholder="7h30" />
                </div>
              </div>
              <div class="field">
                <label class="label">Durée de la pause déjeuner</label>
                <div class="control">
                  <input type="text" name="lunch-break" class="input" placeholder="1h" />
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
      ${footer()}
    </body>
  `
}
