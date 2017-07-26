/**
 * Setting.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    day: {
      type: 'integer',
      defaultsTo: 7.5 * 60 * 60 * 1000
    },
    lunchBreak: {
      type: 'integer',
      defaultsTo: 1 * 60 * 60 * 1000
    },
    start: {
      type: 'datetime'
    },

    payed: {
      type: 'float',
      defaultsTo: 0
    },
    extraDays: {
      type: 'float',
      defaultsTo: 0
    },
    extraHours: {
      type: 'float',
      defaultsTo: 0
    },

    payedTaken: {
      type: 'float',
      defaultsTo: 0
    },
    extraDaysTaken: {
      type: 'float',
      defaultsTo: 0
    },
    extraHoursTaken: {
      type: 'float',
      defaultsTo: 0
    },

    user: {
      model: 'user',
      unique: true
    }
  }
}
