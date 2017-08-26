import html from 'choo/html'

import map from 'lodash/map'
import filter from 'lodash/filter'
import groupBy from 'lodash/groupBy'

import format from 'date-fns/format'
import isSameMonth from 'date-fns/is_same_month'

// import log from 'utils/log'

import timeStrip from 'components/time-strip'
import dateSelector from 'components/date-selector'

export default (state, emit) => {
  const current = state.dateSelector
  const currentlySelectedDate = new Date(current.year, current.month)

  const entries = groupEntries(
    filter(state.timer.entries, entry => isSameMonth(entry.date, currentlySelectedDate))
  )

  return html`
    <section class="section details-component">
      <div class="container">
        <h1 class="title has-text-centered">Détails</h1>
        <hr>
        <form>
          ${dateSelector({ state, emit, change: 'details:select-date', ui: 'details' })}
        </form>
        <br>
        <table class="table is-fullwidth entries">
          <thead>
            <tr>
              <th>Date</th>
              <th>Entrées</th>
            </tr>
          </thead>
          <tbody>
            ${map(entries, (list, date) => showEntryLine(date, list))}
          </tbody>
        </table>
      </div>
    </section>
  `

  // ----------------------
  // Sub-components
  // ----------------------

  function showEntryLine (date, entries) {
    return html`
      <tr>
        <td>${format(date, 'DD/MM/YYYY')}</td>
        <td>
          ${timeStrip(date, entries, emit)}
        </td>
      </tr>
    `
    // ${map(entries, entry => html`<div>${format(entry.date, 'HH:mm:ss')}</div>`)}
  }

  // ----------------------
  // Listeners
  // ----------------------

  // function selectMonth (e) {
  //   log.debug('Selected month:', e.currentTarget.value)
  //
  //   emit('details:month', e.currentTarget.value)
  // }
  //
  // function selectYear (e) {
  //   log.debug('Selected year', e.currentTarget.value)
  //
  //   emit('details:year', e.currentTarget.value)
  // }

  // ----------------------
  // Helpers
  // ----------------------

  function groupEntries (entries) {
    return groupBy(entries, entry => format(entry.date, 'YYYY-MM-DD'))
  }
}
