const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
const { ALERT_MESSAGE } = require('../utils/constants');
const UnauthorizedError = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Ксения',
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Required field to fill in'],
    validator: (v) => isEmail(v),
    message: 'Incorrect email format',
  },
  password: {
    type: String,
    required: [true, 'Required field to fill in'],
    select: false,
  },
}, {
  versionKey: false,
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select(' +password').orFail(new UnauthorizedError(ALERT_MESSAGE.ERROR_AUTHORIZATION))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          throw new UnauthorizedError(ALERT_MESSAGE.ERROR_AUTHORIZATION);
        }

        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
