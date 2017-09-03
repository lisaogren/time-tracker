import extend from 'lodash/extend'

import getDate from 'date-fns/get_date'
import getMonth from 'date-fns/get_month'
import getYear from 'date-fns/get_year'
import getDaysInMonth from 'date-fns/get_days_in_month'

export default (state, emitter) => {
  const now = new Date()

  const defaultState = { year: getYear(now), month: getMonth(now), day: getDate(now) }

  state.dateSelector = {
    default: defaultState
  }

  state.events = extend(state.events, {
    DATESELECTOR_CHANGE: 'dateSelector:change'
  })

  emitter.on(state.events.DOMCONTENTLOADED, () => {
    emitter.on(state.events.DATESELECTOR_CHANGE, setSelectedDate)
  })

  function setSelectedDate ({ ui, type, value }) {
    if (!state.dateSelector[ui]) state.dateSelector[ui] = defaultState

    value = parseInt(value)

    const data = state.dateSelector[ui]

    data[type] = value

    if (type === 'year' || type === 'month') {
      const maxDays = getDaysInMonth(new Date(data.year, data.month))

      if (data.day > maxDays) data.day = maxDays
    }
  }
}
