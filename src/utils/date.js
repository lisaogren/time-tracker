import parseInt from 'lodash/parseInt'

import getDay from 'date-fns/get_day'
import getDate from 'date-fns/get_date'
import getMonth from 'date-fns/get_month'
import getYear from 'date-fns/get_year'
import addDays from 'date-fns/add_days'

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
  },

  isWorkDay: function (date) {
    const dayNumber = getDay(date)
    const day = getDate(date)
    const month = getMonth(date)
    const paques = addDays(this.getEasterByYear(getYear(date)), 1)
    const paqueDay = getDate(paques)
    const paqueMonth = getMonth(paques)
    const pentecote = addDays(this.getEasterByYear(getYear(date)), 50)
    const pentecoteDay = getDate(pentecote)
    const pentecoteMonth = getMonth(pentecote)

    return !(dayNumber === 0) &&                    // exclude Sunday
      !(dayNumber === 6) &&                         // exclude Saturday
      !(day === 1 && month === 0) &&                // exclude 1st day of year
      !(day === 1 && month === 4) &&                // exclude Labor Day (National holiday)
      !(day === 8 && month === 4) &&                // exclude end war 1945 (National holiday)
      !(day === 25 && month === 4) &&               // exclude Ascension (National holiday)
      !(day === 14 && month === 6) &&               // exclude Independence Day(National holiday)
      !(day === 15 && month === 7) &&               // exclude Assomption (National holiday)
      !(day === 1 && month === 10) &&               // exclude Toussaint (National holiday)
      !(day === 11 && month === 10) &&              // exclude Toussaint (National holiday)
      !(day === 25 && month === 11) &&              // exclude Armistice (National holiday)
      !(day === paqueDay && month === paqueMonth) &&         // exclude Paques
      !(day === pentecoteDay && month === pentecoteMonth)   // exclude pentecote
  },

  getEasterByYear: function (year) {
    var a = (year / 100 | 0) * 1483 - (year / 400 | 0) * 2225 + 2613
    var b = ((year % 19 * 3510 + (a / 25 | 0) * 319) / 330 | 0) % 29
    var c = 148 - b - ((year * 5 / 4 | 0) + a - b) % 7

    return new Date(
      year,
      (c / 31 | 0) - 1, // month
      c % 31 + 1 // date
    )
  }
}
