import html from 'choo/html'

import filter from 'lodash/filter'

import getYear from 'date-fns/get_year'
import getMonth from 'date-fns/get_month'
import getDate from 'date-fns/get_date'
import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'

import log from 'utils/log'

import './index.scss'

export default (date, entries, emit) => {
  const noon = new Date(getYear(date), getMonth(date), getDate(date), 12, 1)
  const morningEntries = filter(entries, entry => isBefore(entry.date, noon))
  const afternoonEntries = filter(entries, entry => isAfter(entry.date, noon))

  log.debug('morning entries', morningEntries)
  log.debug('afternoon entries', afternoonEntries)

  return html`
    <div class="time-strip-component">
      <div class="columns scale">
        <div class="column">0h</div>
        <div class="column">1h</div>
        <div class="column">2h</div>
        <div class="column">3h</div>
        <div class="column">4h</div>
        <div class="column">5h</div>
        <div class="column">6h</div>
        <div class="column">7h</div>
        <div class="column">8h</div>
        <div class="column">9h</div>
        <div class="column">10h</div>
        <div class="column">11h</div>
      </div>
      <div class="columns work">
        <div class="column worked"></div>
      </div>
      <div class="columns scale">
        <div class="column">12h</div>
        <div class="column">13h</div>
        <div class="column">14h</div>
        <div class="column">15h</div>
        <div class="column">16h</div>
        <div class="column">17h</div>
        <div class="column">18h</div>
        <div class="column">19h</div>
        <div class="column">20h</div>
        <div class="column">21h</div>
        <div class="column">22h</div>
        <div class="column">23h</div>
      </div>
      <div class="columns work">
        <div class="column worked"></div>
      </div>
    </div>
  `
}
