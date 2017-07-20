/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const merge = require('lodash/merge')
const _super = require('sails-auth/api/models/User')

const User = {
  attributes: {
    settings: {
      collection: 'setting',
      via: 'user'
    },
    timeEntries: {
      collection: 'timeEntry',
      via: 'user'
    }
  }
}

module.exports = merge(_super, User)
