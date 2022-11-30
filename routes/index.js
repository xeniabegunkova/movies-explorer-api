const router = require('express').Router();

const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const NotFound = require('../errors/NotFound');
const { ALERT_MESSAGE } = require('../utils/constants');

const { userSignIn, userSignUp } = require('../middlewares/validation');

router.post('/signin', userSignIn, login);

router.post('/signup', userSignUp, createUser);

router.use(auth);

router.use('/users', require('./users'));

router.use('/movies', require('./movies'));

router.use('*', () => {
  throw new NotFound(ALERT_MESSAGE.NOT_FOUND_ERROR_TEST);
});

module.exports = router;
