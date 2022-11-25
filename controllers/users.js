const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  STATUS_CODES,
  ALERT_MESSAGE,
} = require('../utils/constants');
const NotFound = require('../errors/NotFound');
const Conflict = require('../errors/Conflict');
const BadReq = require('../errors/BadRequest');

const { NODE_ENV, JWT_SECRET } = process.env;

// get

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

// create

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 7)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      const newUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      res.status(STATUS_CODES.WELL_DONE).send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict(ALERT_MESSAGE.EXISTING_EMAIL));
      } else if (err.name === 'ValidationError') {
        next(new BadReq(ALERT_MESSAGE.GET_USER_ERROR));
      } else {
        next(err);
      }
    });
};

// update

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  ).orFail(new NotFound(ALERT_MESSAGE.ID_NOT_FOUND))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// information about user

const getUserById = (req, res, next) => {
  User.findById(req.params.userId).orFail(new NotFound(ALERT_MESSAGE.GET_NOT_FOUND))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadReq(ALERT_MESSAGE.ID_NOT_FOUND));
      }
      return next(err);
    });
};

// login

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then(() => {
          const token = jwt.sign(
            { _id: user._id },
            NODE_ENV === 'production' ? JWT_SECRET : 'secret-key',
            { expiresIn: '7d' },
          );
          res.cookie('jwt', token, {
            maxAge: 3600000 * 12 * 7,
            httpOnly: true,
            sameSite: true,
          })
            .send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  getUserById,
  login,
};
