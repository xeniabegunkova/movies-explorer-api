const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { cors } = require('cors');

const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');

const NotFound = require('../errors/NotFound');
const { ALERT_MESSAGE } = require('../utils/constants');

router.use(cors({
  exposedHeaders: '*',
}));

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use(auth);

router.use('/users', require('./users'));

router.use('/movies', require('./movies'));

router.use('*', () => {
  throw new NotFound(ALERT_MESSAGE.NOT_FOUND_ERROR_TEST);
});

module.exports = router;
