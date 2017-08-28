import $ from 'dominus'
import html from 'choo/html'

import map from 'lodash/map'
import range from 'lodash/range'

import getDate from 'date-fns/get_date'
import getMonth from 'date-fns/get_month'
import getYear from 'date-fns/get_year'
import isSameMonth from 'date-fns/is_same_month'
import isSameYear from 'date-fns/is_same_year'
import getDaysInMonth from 'date-fns/get_days_in_month'

export default (options) => {
  const { state, change, emit, ui, show = {} } = options
  const { day = true, month = true, year = true } = show

  const now = new Date()
  const selected = state.dateSelector[ui] || { year: getYear(now), month: getMonth(now), day: getDate(now) }
  const currentlySelectedDate = new Date(selected.year, selected.month, selected.day)

  // const daySelector = getDaySelector()
  // daySelector.isSameNode = target => ($(target).attr('data-ui') === `day-selector ${ui}`)

  const monthSelector = getMonthSelector()
  monthSelector.isSameNode = target => ($(target).attr('data-ui') === `month-selector ${ui}`)

  const yearSelector = getYearSelector()
  yearSelector.isSameNode = target => ($(target).attr('data-ui') === `year-selector ${ui}`)

  return html`
    <div class="date-selector-component">
      ${day ? getDaySelector() : ''}
      ${month ? monthSelector : ''}
      ${year ? yearSelector : ''}
    </div>
  `

  // ----------------------
  // Sub-components
  // ----------------------

  // Day Selector

  function getDaySelector () {
    const days = range(1, getDaysInMonth(currentlySelectedDate) + 1)

    return html`
      <div class="select" data-ui="day-selector ${ui}">
        <select class="day-selector" data-type="day" onchange=${onChange}>
          ${map(days, dayOption)}
        </select>
      </div>
    `
  }

  function dayOption (day) {
    const isSame = (getDate(currentlySelectedDate) === day)

    return html`
      <option value="${day}" ${isSame ? 'selected' : ''}>${day}</option>
    `
  }

  // Month Selector

  function getMonthSelector () {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ]

    return html`
      <div class="select" data-ui="month-selector ${ui}">
        <select class="month-selector" data-type="month" onchange=${onChange}>
          ${map(months, (month, i) => monthOption(month, i))}
        </select>
      </div>
    `
  }

  function monthOption (label, i) {
    const month = new Date(selected.year, i)
    const isSame = isSameMonth(month, currentlySelectedDate)

    return html`<option value="${i}" ${isSame ? 'selected' : ''}>${label}</option>`
  }

  function getYearSelector () {
    const years = range(1985, getYear(new Date()) + 1)

    return html`
      <div class="select" data-ui="year-selector ${ui}">
        <select class="year-selector" data-type="year" onchange=${onChange}>
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

  function onChange (e) {
    const $el = $(e.currentTarget)

    emit(state.events.DATESELECTOR_CHANGE, { ui, type: $el.attr('data-type'), value: $el.value() })
    emit(change)
  }
}
