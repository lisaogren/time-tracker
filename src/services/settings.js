import get from 'lodash/get'
import first from 'lodash/first'

import api from 'utils/api'
import date from 'utils/date'

export default (state, emitter) => {
  state.settings = {
    error: false,
    success: false
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('settings:save', saveSettings)
    emitter.on('settings:reset', resetSettings)
  })

  function saveSettings (data) {
    const userId = get(state.user, 'data.id')
    const currentSettings = first(get(state.user, 'data.settings'))

    data = {
      day: date.durationToMilliseconds(data.day),
      lunchBreak: date.durationToMilliseconds(data.lunchBreak)
    }

    let request

    if (currentSettings) {
      // Update settings
      const params = { id: currentSettings.id }

      request = api.updateSettings({ params, data })
    } else {
      // Push new settings
      data.user = userId

      request = api.addSettings({ data })
    }

    request.then(success, error)

    function success () {
      state.settings.success = true
      state.settings.error = false

      emitter.emit('user:refresh')
    }

    function error () {
      state.settings.error = true
    }
  }

  function resetSettings () {
    state.settings.success = false
    state.settings.error = false
  }
}
