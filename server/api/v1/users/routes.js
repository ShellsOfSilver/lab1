const router = require('express').Router();

const {
  authFailed,
  existFailed,
} = require('./../auth');
const controller = require('./controller');

router.route('/signup')
  .post(controller.signup, existFailed);

router.route('/signin')
  .post(controller.signin, authFailed);

router.route('/')
  .get(controller.all);

module.exports = router;
