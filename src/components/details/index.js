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

const confirm = window.confirm

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
    let deleteBtn

    if (workTime) {
      balanceEl = balance({ value: workTime, showSign: true })
    }

    if (entries.length) {
      deleteBtn = html`
        <button class="button is-danger is-inverted" onclick=${partial(clearWorkTime, date)}>
          <span clas="icon">
            <i class="fa fa-close"></i>
          </span>
        </button>
      `
    }

    return html`
      <tr class="entry ${isWeekend(date) ? 'is-weekend' : ''}">
        <td class="entry-info">
          <span class="date">
            ${format(date, 'dddd')}<br>
            ${format(date, 'DD/MM/YYYY')}
          </span>
          <span class="balance">
            ${balanceEl}
          </span>
          <span class="actions">
            <button class="button is-primary is-inverted" onclick=${partial(setNormalWorkTime, date)}>
              <span class="icon">
                <i class="fa fa-check"></i>
              </span>
            </button>
            ${deleteBtn}
          </span>
        </td>
        <td onclick=${onClick}>
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

  function setNormalWorkTime (date, e) {
    e.preventDefault()

    const hasEntries = filter(entries, entry => isSameDay(entry.date, date))

    let needsConfirm = Boolean(hasEntries.length)
    let userConfirm = true

    if (needsConfirm) {
      userConfirm = confirm(
        `Es-tu sûr de vouloir remplacer les entrées actuelles du ${format(date, 'DD MMMM YYYY')} ?`
      )
    }

    if (userConfirm) emit(state.events.DETAILS_SET_NORMAL_WORK_TIME, date)
  }

  function clearWorkTime (date, e) {
    e.preventDefault()

    if (confirm(`Es-tu sûr de vouloir supprimer les entrées du ${format(date, 'DD MMMM YYYY')} ?`)) {
      emit(state.events.DETAILS_CLEAR_DAY, date)
    }
  }
}
