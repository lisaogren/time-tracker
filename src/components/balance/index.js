import html from 'choo/html'

import { millisecondsToDuration } from 'utils/date'

import './index.scss'

export default ({ value, showSign = false }) => {
  let type

  if (showSign) {
    if (value < 0) type = 'is-negative'
    else if (value > 0) type = 'is-positive'
    else showSign = false
  }

  return html`
    <span class="balance-component ${type}">${millisecondsToDuration({ time: value, showSign })}</span>
  `
}
