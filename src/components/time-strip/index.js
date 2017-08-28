import html from 'choo/html'

import forEach from 'lodash/forEach'
import range from 'lodash/range'

import startOfDay from 'date-fns/start_of_day'

import { differenceInDecimalHours } from 'utils/date'
import { isEven } from 'utils/numbers'

import './index.scss'

const oneHourInPercent = 100 / 24

export default (date, entries, emit) => {
  const start = startOfDay(date)

  return html`
    <div class="time-strip-component">
      ${scaleBlocks()}
      ${workBlocks()}
    </div>
  `

  // ----------------------
  // Sub-components
  // ----------------------

  function workBlocks () {
    const blocks = []

    forEach(entries, (entry, i) => {
      let next = entries[i + 1]

      if (isEven(i) && next) {
        const left = oneHourInPercent * differenceInDecimalHours(entry.date, start)
        const width = (oneHourInPercent * differenceInDecimalHours(next.date, start)) - left

        blocks.push({ left, width, startId: entry.id, endId: next.id })
      }
    })

    return html`<div class="columns work">${blocks.map(workBlock)}</div>`
  }

  function workBlock (block) {
    return html`
      <div
        class="column worked"
        data-start-id="${block.startId}"
        data-end-id="${block.endId}"
        style="left: ${block.left}%; width: ${block.width}%;"
      >
      </div>
    `
  }

  function scaleBlocks () {
    const hours = range(0, 24, 2)

    return html`<div class="columns is-mobile scale">${hours.map(scaleBlock)}</div>`
  }

  function scaleBlock (i) {
    return html`<div class="column">${i}h</div>`
  }
}
