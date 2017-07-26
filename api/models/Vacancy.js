/**
 * Vacancy.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    type: {
      type: 'string'
    },
    start: {
      type: 'datetime'
    },
    end: {
      type: 'datetime'
    },

    user: {
      model: 'user'
    }
  }
}
