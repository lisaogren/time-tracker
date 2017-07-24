import html from 'choo/html'

import get from 'lodash/get'
import filter from 'lodash/filter'
import first from 'lodash/first'
import isEmpty from 'lodash/isEmpty'
import forEach from 'lodash/forEach'

import isToday from 'date-fns/is_today'
import isThisWeek from 'date-fns/is_this_week'
import isThisMonth from 'date-fns/is_this_month'
import differenceInMilliseconds from 'date-fns/difference_in_milliseconds'

import date from 'utils/date'

import './index.scss'

export default (state, emit) => {
  const { timer } = state

  const settings = first(get(state.user, 'data.settings')) || {}

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
        <div class="columns resume">
          <div class="column is-half-mobile">
            <p>Aujourd'hui</p>
          </div>
          <div class="column is-half-mobile">
            ${resume('today')}
          </div>
        </div>
        <div class="columns resume">
          <div class="column is-half-mobile">
            <p>Cette semaine</p>
          </div>
          <div class="column is-half-mobile">
            ${resume('week')}
          </div>
        </div>
        <div class="columns resume">
          <div class="column is-half-mobile">
            <p>Ce mois-ci</p>
          </div>
          <div class="column is-half-mobile">
            ${resume('month')}
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
        class="button is-very-large is-${timer.started ? 'info' : 'primary'}"
        onclick=${toggle}
      >
        <span class="icon">
          <i class="fa fa-${timer.started ? 'stop' : 'play'}"></i>
        </span>
        <span>${timer.started ? 'Arrêter' : `C'est parti !`}</span>
      </button>
    `
  }

  function showTime ({ type, value }) {
    value = date.millisecondsToDuration(value)

    return html`
      <p class="is-${type}">${type === 'positive' ? '+' : '-'} ${value}</p>
    `
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

  function filterEntries (condition) {
    return filter(timer.entries, entry => condition(entry.date))
  }

  function resume (type) {
    const entries = filterEntries(getDateFilter(type))
    const max = getSettings(type)

    if (isEmpty(entries)) {
      return showTime({ type: 'negative', value: max })
    }

    const done = getCumulatedWorkTime(entries)

    return showTime({
      type: getValueType(done < max),
      value: max - done
    })
  }

  function getDateFilter (type) {
    const filters = {
      today: isToday,
      week: isThisWeek,
      month: isThisMonth
    }

    return filters[type]
  }

  function getCumulatedWorkTime (entries) {
    let done = 0

    forEach(entries, (entry, i) => {
      let next = entries[i + 1]

      if (!next) next = { date: new Date() }

      if (isEven(i)) {
        done += differenceInMilliseconds(next.date, entry.date)
      }
    })

    return done
  }

  function getSettings (type) {
    const settingsMap = {
      today: settings.day,
      week: getWeekTotal(),
      month: getMonthTotal()
    }

    return settingsMap[type]
  }

  function getValueType (isNegative) {
    return isNegative ? 'negative' : 'positive'
  }

  function getWeekTotal () {
    return settings.day * 5
  }

  function getMonthTotal () {
    return settings.day * 20
  }

  function isEven (i) {
    return !(i % 2)
  }
}
