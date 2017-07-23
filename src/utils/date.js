import parseInt from 'lodash/parseInt'

const oneHourInMilliseconds = 1 * 60 * 60 * 1000
const oneMinuteInMilliseconds = 1 * 60 * 1000
const durationRegex = /^(\d{0,2})h?(\d{0,2})m?i?n?$/i

export default {
  millisecondsToDuration (time) {
    time = time * 1 // meh ? cast to int or float ?

    const milliseconds = parseInt(time, 10)
    const seconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(seconds / 3600)
    let minutes = Math.floor((seconds - (hours * 3600)) / 60)

    if (hours > 0 && minutes < 10) {
      minutes = '0' + minutes
    }

    if (time === 0 || time < oneHourInMilliseconds) {
      return minutes + 'm'
    } else if ((time % oneHourInMilliseconds) === 0) {
      return hours + 'h'
    }

    return hours + 'h' + minutes
  },

  durationToMilliseconds (duration = '') {
    const oneHourInMilliseconds = 1 * 60 * 60 * 1000
    const oneMinuteInMilliseconds = 1 * 60 * 1000
    const durationRegex = /^(\d{0,2})h?(\d{0,2})m?i?n?$/i
    const matches = duration.match(durationRegex)

    let hours = matches[1]
    let minutes = matches[2]

    if (!minutes.length && duration.indexOf('h') === -1) {
      minutes = hours
      hours = 0
    }

    hours = parseInt(hours)
    minutes = parseInt(minutes)

    if (isNaN(hours)) hours = 0
    if (isNaN(minutes)) minutes = 0

    return (hours * oneHourInMilliseconds) + (minutes * oneMinuteInMilliseconds)
  }
}
