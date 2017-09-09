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
            ${dateField({ name: 'start-date', label: 'Début', date: start.date || data.date })}
            ${dateField({ name: 'end-date', label: 'Fin', date: end.date || data.date })}
          </section>
          <footer class="modal-card-foot">
            <button type="submit" class="button is-success">
              <span class="icon">
                <i class="fa fa-check"></i>
              </span>
              <span>${edit ? 'Sauvegarder' : 'Ajouter'}</span>
            </button>
            ${deleteBtn()}
            <button type="button" class="button" onclick=${close}>
              <span class="icon">
                <i class="fa fa-close"></i>
              </span>
              <span>Annuler</span>
            </button>
          </footer>
        </div>
      </div>
    </form>
  `

  // ----------------------
  // Sub-components
  // ----------------------

  function dateField ({ name, label, date }) {
    defer(() => {
      selector(`[name=${name}]`, { defaultDate: date })
    })

    return html`
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">${label}</label>
        </div>
        <div class="field-body">
          <div class="field">
            <div class="control">
              <input class="input" type="text" name="${name}" />
            </div>
          </div>
        </div>
      </div>
    `
  }

  function deleteBtn () {
    if (!edit) return

    return html`
      <button type="button" class="button is-danger" onclick=${del}>
        <span class="icon">
          <i class="fa fa-trash-o"></i>
        </span>
        <span>Supprimer</span>
      </button>
    `
  }

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

  function del () {
    const { startId, endId } = data

    emit(state.events.DETAILS_DELETE, { entries: [startId, endId] })
  }

  function close () {
    emit(state.events.DETAILS_CLOSE)
  }
}
