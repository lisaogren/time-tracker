import html from 'choo/html'

import filter from 'lodash/filter'
import forEach from 'lodash/forEach'
import range from 'lodash/range'

import isBefore from 'date-fns/is_before'
import isAfter from 'date-fns/is_after'
import startOfDay from 'date-fns/start_of_day'

import { differenceInDecimalHours, getNoon } from 'utils/date'

import log from 'utils/log'
import { isOdd, isEven } from 'utils/numbers'

import './index.scss'

const oneHourInPercent = 100 / 12

export default (date, entries, emit) => {
  const start = startOfDay(date)
  const noon = getNoon(date)
  const morningEntries = filter(entries, entry => isBefore(entry.date, noon))
  const afternoonEntries = filter(entries, entry => isAfter(entry.date, noon))

  if (isOdd(morningEntries.length)) {
    morningEntries.push({ date: noon })
  }

  if (isOdd(afternoonEntries.length)) {
    afternoonEntries.unshift({ date: noon })
  }

  log.debug('morning entries', morningEntries)
  log.debug('afternoon entries', afternoonEntries)

  return html`
    <div class="time-strip-component">
      ${scaleBlocks(0, 12)}
      ${workBlocks(start, morningEntries)}
      ${scaleBlocks(12, 24)}
      ${workBlocks(noon, afternoonEntries)}
    </div>
  `

  function workBlocks (start, entries) {
    const blocks = []

    forEach(entries, (entry, i) => {
      let next = entries[i + 1]

      if (isEven(i)) {
        const left = oneHourInPercent * differenceInDecimalHours(entry.date, start)
        const width = (oneHourInPercent * differenceInDecimalHours(next.date, start)) - left

        blocks.push({ left, width })
      }
    })

    return html`
      <div class="columns work">
        ${blocks.map(workBlock)}
      </div>
    `
  }

  function workBlock (block) {
    return html`<div class="column worked" style="left: ${block.left}%; width: ${block.width}%;"></div>`
  }

  function scaleBlocks (start, end) {
    const hours = range(start, end)

    return html`
      <div class="columns scale">
        ${hours.map(scaleBlock)}
      </div>
    `
  }

  function scaleBlock (i) {
    return html`<div class="column">${i}h</div>`
  }
}
