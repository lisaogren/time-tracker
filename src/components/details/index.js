import $ from 'dominus'
import html from 'choo/html'

import map from 'lodash/map'
import filter from 'lodash/filter'
import partial from 'lodash/partial'

import { format } from 'utils/date'
import eachDay from 'date-fns/each_day'
import endOfMonth from 'date-fns/end_of_month'
import startOfMonth from 'date-fns/start_of_month'
import isSameDay from 'date-fns/is_same_day'
import isWeekend from 'date-fns/is_weekend'

import log from 'utils/log'

import timeStrip from 'components/time-strip'
import dateSelector from 'components/date-selector'

import './index.scss'

export default (state, emit) => {
  log.debug('[components/details] Init component')

  const current = state.dateSelector.details || { year: 2017, month: 7 }
  const date = new Date(current.year, current.month)
  const entries = state.timer.entries

  const days = map(
    eachDay(startOfMonth(date), endOfMonth(date)),
    day => ({ date: day, entries: filter(entries, entry => isSameDay(entry.date, day)) })
  )

  const detailsDateSelector = dateSelector({
    ui: 'details',
    change: 'details:select-date',
    show: {
      day: false
    },
    state,
    emit
  })

  return html`
    <section class="section details-component">
      <div class="container">
        <h1 class="title has-text-centered">Détails</h1>
        <hr>
        <form>
          ${detailsDateSelector}
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
            ${map(days, showEntryLine)}
          </tbody>
        </table>
      </div>
    </section>
  `

  // ----------------------
  // Sub-components
  // ----------------------

  function showEntryLine ({ date, entries }) {
    const onClick = partial(edit, date, entries)

    return html`
      <tr class="entry ${isWeekend(date) ? 'is-weekend' : ''}" onclick=${onClick}>
        <td>
          ${format(date, 'dddd')}<br>
          ${format(date, 'DD/MM/YYYY')}
        </td>
        <td>
          ${timeStrip(date, entries, emit)}
        </td>
      </tr>
    `
  }

  // ----------------------
  // Listeners
  // ----------------------

  function edit (date, entries, e) {
    e.preventDefault()

    const $el = $(e.target)

    log.debug(`[components/details] Editing entries for ${date}`, entries)
    log.debug($el.attr('data-start-id'), $el.attr('data-end-id'))
  }
}
