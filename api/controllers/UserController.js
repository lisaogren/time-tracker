/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const get = require('lodash/get');
const groupBy = require('lodash/groupBy');

module.exports = {
  resume (req, res) {
    const id = req.params.id;

    User.findOne({ id }).populate('settings').then(user => {
      if (!user) return res.send(500, 'Could not find user with id=' + id);

      console.log('Found user', user);

      const settings = get(user, 'settings[0]');

      if (!settings) return res.send(500, 'Could not find general settings for user id=' + id);

      const days =

      res.ok(user);
    });
  }
};
