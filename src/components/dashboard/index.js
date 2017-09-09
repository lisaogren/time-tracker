import html from 'choo/html'

// import get from 'lodash/get'
import filter from 'lodash/filter'
import first from 'lodash/first'
import last from 'lodash/last'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

import isToday from 'date-fns/is_today'
import isBefore from 'date-fns/is_before'
import subDays from 'date-fns/sub_days'
import isSameDay from 'date-fns/is_same_day'

import date from 'utils/date'

import balance from 'components/balance'

import './index.scss'

export default (state, emit) => {
  const { timer } = state
  const noEntries = isEmpty(timer.entries)

  // const settings = first(get(state.user, 'data.settings')) || {}

  return html`
    <section class="section dashboard-component">
      <div class="container">
        ${noEntries ? showNoEntries() : showDashboard()}

        <hr>

        <p class="has-text-centered">
          ${toggleTimerButton()}
        </p>
      </div>
    </section>
  `

  // ----------------------
  // Sub-components
  // ----------------------

  function toggleTimerButton () {
    return html`
      <button
        data-ui="toggle-timer"
        class="button is-large is-${timer.started ? 'info' : 'primary'}"
        onclick=${toggle}
      >
        <span class="icon">
          <i class="fa fa-${timer.started ? 'stop' : 'play'}"></i>
        </span>
        <span>${timer.started ? 'Arrêter' : `C'est parti !`}</span>
      </button>
    `
  }

  function showBalance (type) {
    return balance({ value: getBalance(type), showSign: true })
  }

  function showWorkTime () {
    return balance({ value: workTime() })
  }

  function showDashboard () {
    return html`
      <div>
        <h1 class="title has-text-centered">
          <span class="icon is-medium">
            <i class="fa fa-clock-o"></i>
          </span>
          <span>Résumé</span>
        </h1>

        <hr>

        <h2 class="subtitle">
          Heures Supp'
        </h2>
        <div class="columns resume">
          <div class="column is-half-mobile">
            <p>Aujourd'hui</p>
          </div>
          <div class="column is-half-mobile">
            ${showBalance('today')}
          </div>
        </div>
        <div class="columns resume">
          <div class="column is-half-mobile">
            <p>Total</p>
          </div>
          <div class="column is-half-mobile">
            ${showBalance('total')}
          </div>
        </div>

        <hr>

        <h2 class="subtitle">
          Temps travaillé
        </h2>
        <div class="columns resume">
          <div class="column is-half-mobile">
            <p>Aujourd'hui</p>
          </div>
          <div class="column is-half-mobile">
            ${showWorkTime()}
          </div>
        </div>
      </div>
    `
  }

  function showNoEntries () {
    return html`
      <p>
        Tu n'as pas de données pour le moment
      </p>
    `
  }

  // ----------------------
  // Listeners
  // ----------------------

  function toggle () {
    if (timer.started) emit(state.events.TIMER_STOP)
    else emit(state.events.TIMER_START)
  }

  // ----------------------
  // Helpers
  // ----------------------

  function getBalance (type) {
    const now = new Date()

    let entries = timer.entries
    let start
    let end

    if (type === 'today') {
      start = now
      end = now
      entries = filter(entries, entry => isToday(entry.date))
    } else if (type === 'total') {
      const lastEntryDate = last(entries).date

      start = first(entries).date
      end = findPreviousWorkedDay(lastEntryDate, entries)

      if (isBefore(end, start)) {
        return 0
      }

      entries = filter(entries, entry => !isSameDay(entry.date, lastEntryDate))
    }

    return date.getWorkTimeBalance(entries, start, end)
  }

  function workTime () {
    const entries = filter(timer.entries, entry => isToday(entry.date))

    return date.getCumulatedWorkTime(entries)
  }

  function findPreviousWorkedDay (start, entries) {
    start = subDays(start, 1)

    if (!date.isWorkDay(start) || !find(entries, entry => isSameDay(entry.date, start))) {
      return findPreviousWorkedDay(start, entries)
    }

    return start
  }
}
