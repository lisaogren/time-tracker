import $ from 'dominus'
import html from 'choo/html'

import map from 'lodash/map'
import filter from 'lodash/filter'
import partial from 'lodash/partial'

import { format, getWorkTimeBalance } from 'utils/date'
import eachDay from 'date-fns/each_day'
import endOfMonth from 'date-fns/end_of_month'
import startOfMonth from 'date-fns/start_of_month'
import isSameDay from 'date-fns/is_same_day'
import isWeekend from 'date-fns/is_weekend'

import log from 'utils/log'

import editDetails from './edit'
import timeStrip from 'components/time-strip'
import dateSelector from 'components/date-selector'
import balance from 'components/balance'

import './index.scss'

export default (state, emit) => {
  log.debug('[components/details] Init component')

  const current = state.dateSelector.details || state.dateSelector.default
  const date = new Date(current.year, current.month)
  const entries = state.timer.entries
  const showEdit = Boolean(state.details.edit || state.details.add)

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
        ${showEdit ? editDetails(state, emit) : ''}
      </div>
    </section>
  `

  // ----------------------
  // Sub-components
  // ----------------------

  function showEntryLine ({ date, entries }) {
    const onClick = partial(edit, date)
    const workTime = getWorkTimeBalance(entries, date)

    let balanceEl
    if (workTime) balanceEl = balance({ value: workTime, showSign: true })

    return html`
      <tr class="entry ${isWeekend(date) ? 'is-weekend' : ''}" onclick=${onClick}>
        <td class="entry-info">
          <span class="date">
            ${format(date, 'dddd')}<br>
            ${format(date, 'DD/MM/YYYY')}
          </span>
          <span class="balance">
            ${balanceEl}
          </span>
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

  function edit (date, e) {
    e.preventDefault()

    const $el = $(e.target)

    if ($el.attr('data-type') !== 'worked') {
      return add(date)
    }

    log.debug(`[components/details] Editing entries for ${date}`)

    const startId = $el.attr('data-start-id')
    const endId = $el.attr('data-end-id')

    emit(state.events.DETAILS_EDIT, { date, startId, endId })
  }

  function add (date) {
    log.debug(`[components/details] Adding entries for ${date}`)

    emit(state.events.DETAILS_ADD, { date })
  }
}
