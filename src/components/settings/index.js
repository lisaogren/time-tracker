import html from 'choo/html'

import get from 'lodash/get'
import first from 'lodash/first'

// import log from 'utils/log'
import date from 'utils/date'
import serialize from 'utils/form-serialize'

import technicalError from 'components/technical-error'

import './index.scss'

export default (state, emit) => {
  const settings = first(get(state.user.data, 'settings')) || {}

  return html`
    <section class="section settings-component">
      <div class="container">
        <h1 class="title has-text-centered">Paramètres généraux</h1>
        <hr>
        <form onsubmit=${submitSettings}>
          ${settingsSuccess()}
          ${settingsError()}
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Durée d'une journée de travail</label>
                <div class="control">
                  <input type="text" name="day" class="input" placeholder="7h30" value="${getDuration('day')}" />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Durée de la pause déjeuner</label>
                <div class="control">
                  <input type="text" name="lunchBreak" class="input" placeholder="1h" value="${getDuration('lunchBreak')}" />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Début de contrat</label>
                <div class="control">
                  <input type="date" name="start" class="input" placeholder="" onchange=${selectDate} />
                </div>
              </div>
            </div>
          </div>
          <div class="field">
            <div class="control actions">
              <button class="button is-primary">Sauvegarder les modifications</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  `

  // ----------------------
  // Sub-components
  // ----------------------

  function settingsSuccess () {
    if (!state.settings.success) return ''

    emit(state.events.SETTINGS_RESET)

    return html`
      <div class="columns">
        <div class="column is-one-third-desktop is-offset-4-desktop is-half-tablet is-offset-3-tablet">
          <div class="notification is-success settings-success">
            <span>Les paramètres ont bien été sauvegardés</span>
          </div>
        </div>
      </div>
    `
  }

  function settingsError () {
    if (!state.settings.error) return ''

    return html`
      <div class="columns">
        <div class="column is-one-third-desktop is-offset-4-desktop is-half-tablet is-offset-3-tablet">
          <div class="notification is-warning settings-error">
            ${technicalError()}
          </div>
        </div>
      </div>
    `
  }

  // ----------------------
  // Listeners
  // ----------------------

  function submitSettings (e) {
    e.preventDefault()

    const data = serialize(e.currentTarget)

    emit(state.events.SETTINGS_SAVE, data)
  }

  function selectDate (e) {
    // const value = e.currentTarget.value

    // log.debug('[components/settings] is work day', value, date.isWorkDay(value))
    // log.debug('[components/settings] work days', date.workDaysInMonth(value))
  }

  // ----------------------
  // Helpers
  // ----------------------

  function getDuration (field) {
    const value = settings[field]

    return value ? date.millisecondsToDuration(value) : ''
  }
}
