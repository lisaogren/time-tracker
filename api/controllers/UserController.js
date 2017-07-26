/**
 * UserController
 *
 * @description :: Server-side logic for managing timeentries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

/* globals User */

const get = require('lodash/get')
const merge = require('lodash/merge')
const _super = require('sails-auth/api/controllers/UserController')

const controller = {
  me (req, res) {
    const id = get(req.session, 'user.id')

    if (!id) return res.ok(null)

    User.findOne({ id })
      .populate('settings')
      .populate('timeEntries')
      .populate('vacancies')
      .then(user => res.ok(user))
      .catch(() => res.ok(null))
  }
}

module.exports = merge(_super, controller)
