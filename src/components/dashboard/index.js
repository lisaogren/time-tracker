import html from 'choo/html'

import get from 'lodash/get'
import filter from 'lodash/filter'
import first from 'lodash/first'
import last from 'lodash/last'

import isToday from 'date-fns/is_today'
import isBefore from 'date-fns/is_before'
import subDays from 'date-fns/sub_days'

import date from 'utils/date'

import './index.scss'

export default (state, emit) => {
  const { timer } = state

  // const settings = first(get(state.user, 'data.settings')) || {}

  return html`
    <section class="section dashboard-component">
      <div class="container">
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
            <p>6h30</p>
          </div>
        </div>

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

  function showTime (value) {
    const type = value < 0 ? 'negative' : 'positive'
    value = date.millisecondsToDuration(value)

    return html`
      <p class="is-${type}">${value}</p>
    `
  }

  function showBalance (type) {
    return showTime(balance(type))
  }

  // ----------------------
  // Listeners
  // ----------------------

  function toggle () {
    if (timer.started) emit('timer:stop')
    else emit('timer:start')
  }

  // ----------------------
  // Helpers
  // ----------------------

  function balance (type) {
    const today = new Date()

    let entries = timer.entries
    let start
    let end

    if (type === 'today') {
      start = today
      end = today
      entries = filter(entries, entry => isToday(entry.date))
    } else if (type === 'total') {
      start = first(entries).date
      end = subDays(last(entries).date, 1)

      if (isBefore(end, start)) {
        end = last(entries).date
      }

      entries = filter(entries, entry => !isToday(entry.date))
    }

    return date.getWorkTimeBalance(start, end, entries)
  }
}
