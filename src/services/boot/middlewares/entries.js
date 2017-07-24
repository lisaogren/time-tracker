import log from 'utils/log'

import get from 'lodash/get'
import last from 'lodash/last'

export default (state) => {
  log.debug('[services/boot] Running "entries" middleware')

  // Extract entries data from user
  const entries = get(state.user, 'data.timeEntries', [])

  // Store entries
  state.timer.entries = entries

  // Determine if timer is started
  state.timer.started = Boolean(state.timer.entries.length % 2)

  if (state.timer.started) {
    state.timer.current = last(entries)
  }
}
