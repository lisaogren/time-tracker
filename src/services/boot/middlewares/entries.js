import get from 'lodash/get'
import last from 'lodash/last'
import sortBy from 'lodash/sortBy'

import log from 'utils/log'
import { isOdd } from 'utils/numbers'

export default (state) => {
  log.debug('[services/boot] Running "entries" middleware')

  // Extract entries data from user
  const entries = get(state.user, 'data.timeEntries', [])

  // Store entries
  state.timer.entries = sortBy(entries, 'date')

  // Determine if timer is started
  state.timer.started = isOdd(state.timer.entries.length)

  if (state.timer.started) {
    state.timer.current = last(entries)
  }
}
