import html from 'choo/html'

import find from 'lodash/find'

import { format } from 'utils/date'

export default (state, emit) => {
  const entries = state.timer.entries
  let start = {}
  let end = {}
  let data = state.details.edit || state.details.add
  const isActive = Boolean(data)
  const edit = Boolean(state.details.edit)

  if (!data) data = {}

  if (edit) {
    const { startId, endId } = data

    start = find(entries, { id: parseInt(startId) })
    end = find(entries, { id: parseInt(endId) })
  }

  return html`
    <div class="modal ${isActive ? 'is-active' : ''}">
      <div class="modal-background" onclick=${close}></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">${edit ? 'Modifier' : 'Ajouter'} une période</p>
          <button class="delete" aria-label="close" onclick=${close}></button>
        </header>
        <section class="modal-card-body">
          <form onsubmit=${submit}>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">Start</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input" name="start-date" type="date" value="${format(start.date, 'YYYY-MM-DD')}" />
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <input class="input" name="start-time" type="time" value="${format(start.date, 'HH:mm')}" onchange=${change} />
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal">
                <label class="label">End</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input" name="end-date" type="date" value="${end}" />
                  </div>
                </div>
                <div class="field">
                  <div class="control">
                    <input class="input" name="end-time" type="time" value="${end}" />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success">${edit ? 'Sauvegarder' : 'Ajouter'}</button>
          <button class="button">Annuler</button>
        </footer>
      </div>
    </div>
  `

  // ----------------------
  // Listeners
  // ----------------------

  function submit (e) {
    e.preventDefault()
  }

  function close () {
    emit(state.events.DETAILS_CLOSE)
  }

  function change (e) {
    console.log(e.currentTarget.value)
  }
}
