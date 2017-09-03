import $ from 'dominus'
import html from 'choo/html'

import find from 'lodash/find'
import defer from 'lodash/defer'

import { selector } from 'utils/date'

export default (state, emit) => {
  const entries = state.timer.entries
  let start = {}
  let end = {}
  let data = state.details.edit || state.details.add
  const edit = Boolean(state.details.edit)

  if (!data) data = {}

  if (edit) {
    const { startId, endId } = data

    start = find(entries, { id: parseInt(startId) })
    end = find(entries, { id: parseInt(endId) })
  }

  defer(() => {
    selector('[name=start-date]', { defaultDate: start.date || data.date })
    selector('[name=end-date]', { defaultDate: end.date || data.date })
  })

  return html`
    <form onsubmit=${submit}>
      <div class="modal is-active details-edit-component">
        <div class="modal-background" onclick=${close}></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">${edit ? 'Modifier' : 'Ajouter'} une période</p>
            <button type="button" class="delete" aria-label="close" onclick=${close}></button>
          </header>
          <section class="modal-card-body">
            <form onsubmit=${submit}>
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label">Début</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <input class="input" type="text" name="start-date" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label">Fin</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control">
                      <input class="input" type="text" name="end-date" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </section>
          <footer class="modal-card-foot">
            <button type="submit" class="button is-success">${edit ? 'Sauvegarder' : 'Ajouter'}</button>
            <button type="button" class="button" onclick=${close}>Annuler</button>
          </footer>
        </div>
      </div>
    </form>
  `

  // ----------------------
  // Listeners
  // ----------------------

  function submit (e) {
    e.preventDefault()

    const { startId, endId } = data

    emit(state.events.DETAILS_SAVE, {
      edit,
      start: {
        id: startId,
        date: $('[name=start-date]').value()
      },
      end: {
        id: endId,
        date: $('[name=end-date]').value()
      }
    })
  }

  function close () {
    emit(state.events.DETAILS_CLOSE)
  }
}
