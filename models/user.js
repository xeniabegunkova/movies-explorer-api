const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Required field to fill in'],
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

module.exports = mongoose.model('user', userSchema);
