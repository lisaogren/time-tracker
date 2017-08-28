import $ from 'dominus'
import html from 'choo/html'

import map from 'lodash/map'
import range from 'lodash/range'

import getYear from 'date-fns/get_year'
import isSameMonth from 'date-fns/is_same_month'
import isSameYear from 'date-fns/is_same_year'

export default (options) => {
  const { state, change, emit } = options
  const selected = state.dateSelector
  const currentlySelectedDate = new Date(selected.year, selected.month)

  let ui = `date-selector:${options.ui}`

  const monthSelector = getMonthSelector()
  monthSelector.isSameNode = target => ($(target).attr('data-ui') === ui)

  const yearSelector = getYearSelector()
  yearSelector.isSameNode = target => ($(target).attr('data-ui') === ui)

  function getMonthSelector () {
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ]

    return html`
      <div class="select" data-ui="month-selector">
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
      <div class="select" data-ui="year-selector">
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

  function onChange (e) {
    const $el = $(e.currentTarget)

    emit(state.events.DATESELECTOR_CHANGE, { type: $el.attr('data-type'), value: $el.value() })
    emit(change)
  }

  return html`
    <div>
      ${monthSelector}
      ${yearSelector}
    </div>
  `
}
