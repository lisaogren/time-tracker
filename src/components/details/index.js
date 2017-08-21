import $ from 'dominus'
import html from 'choo/html'

import map from 'lodash/map'
import filter from 'lodash/filter'
import groupBy from 'lodash/groupBy'

import format from 'date-fns/format'
// import getYear from 'date-fns/get_year'
// import isThisMonth from 'date-fns/is_this_month'
import isThisYear from 'date-fns/is_this_year'
import isSameMonth from 'date-fns/is_same_month'
import isSameYear from 'date-fns/is_same_year'

import log from 'utils/log'

import timeStrip from 'components/time-strip'

export default (state, emit) => {
  const current = state.details
  const currentlySelectedDate = new Date(current.year, current.month)

  console.log(currentlySelectedDate)

  const entries = groupEntries(
    filter(state.timer.entries, entry => isSameMonth(entry.date, currentlySelectedDate))
  )

  const monthSelector = getMonthSelector()
  monthSelector.isSameNode = function (target) {
    return state.app.current === 'details' &&
      $(target).attr('data-ui') === 'month-selector'
  }

  const yearSelector = getYearSelector()
  yearSelector.isSameNode = function (target) {
    return state.app.current === 'details' &&
      $(target).attr('data-ui') === 'year-selector'
  }

  return html`
    <section class="section details-component">
      <div class="container">
        <h1 class="title has-text-centered">Détails</h1>
        <hr>
        <form>
          ${monthSelector}
          ${yearSelector}
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

  function getMonthSelector () {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ]

    return html`
      <div class="select" data-ui="month-selector">
        <select class="month-selector" onchange=${selectMonth}>
          ${map(months, (month, i) => monthOption(month, i))}
        </select>
      </div>
    `
  }

  function monthOption (label, i) {
    const month = new Date(current.year, i)
    const isSame = isSameMonth(month, currentlySelectedDate)

    if (isSame) {
      return html`<option value="${i}" selected="selected">${label}</option>`
    }

    return html`<option value="${i}">${label}</option>`
  }

  function getYearSelector () {
    let year = 1985

    const years = []

    do {
      years.push(year)
      year += 1
    } while (!isThisYear(new Date(year - 1, 1, 1)))

    return html`
      <div class="select" data-ui="year-selector">
        <select class="year-selector" onchange=${selectYear}>
          ${map(years, year => yearOption(year))}
        </select>
      </div>
    `
  }

  function yearOption (year) {
    return html`
      <option value="${year}" ${isSameYear(new Date(year, 1), currentlySelectedDate) ? 'selected' : ''}>
        ${year}
      </option>
    `
  }

  // ----------------------
  // Listeners
  // ----------------------

  function selectMonth (e) {
    log.debug('Selected month:', e.currentTarget.value)

    emit('details:month', e.currentTarget.value)
  }

  function selectYear (e) {
    log.debug('Selected year', e.currentTarget.value)

    emit('details:year', e.currentTarget.value)
  }

  // ----------------------
  // Helpers
  // ----------------------

  function groupEntries (entries) {
    return groupBy(entries, entry => format(entry.date, 'YYYY-MM-DD'))
  }
}
