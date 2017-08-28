import get from 'lodash/get'
import first from 'lodash/first'
import extend from 'lodash/extend'

import api from 'utils/api'
import date from 'utils/date'

export default (state, emitter) => {
  // Initialise settings state
  state.settings = {
    error: false,
    success: false
  }

  state.events = extend(state.events, {
    SETTINGS_SAVE: 'settings:save',
    SETTINGS_RESET: 'settings:reset'
  })

  // Wait for DOM before registering emitter events to speed up first paint
  emitter.on(state.events.DOMCONTENTLOADED, () => {
    emitter.on(state.events.SETTINGS_SAVE, saveSettings)
    emitter.on(state.events.SETTINGS_RESET, resetSettings)
  })

  // ----------------------
  // Listeners
  // ----------------------

  function saveSettings (data) {
    const userId = get(state.user, 'data.id')
    const currentSettings = first(get(state.user, 'data.settings'))

    data.day = date.durationToMilliseconds(data.day)
    data.lunchBreak = date.durationToMilliseconds(data.lunchBreak)

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

      emitter.emit(state.events.USER_REFRESH)
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
