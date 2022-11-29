const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Required field to fill in'],
  },
  director: {
    type: String,
    required: [true, 'Required field to fill in'],
  },
  duration: {
    type: Number,
    required: [true, 'Required field to fill in'],
  },
  year: {
    type: String,
    required: [true, 'Required field to fill in'],
  },
  description: {
    type: String,
    required: [true, 'Required field to fill in'],
  },
  image: {
    type: String,
    required: [true, 'Required field to fill in'],
    validate: {
      validator: (v) => /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/gim.test(v),
      message: 'Incorrect link format',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Required field to fill in'],
    validate: {
      validator: (v) => /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/gim.test(v),
      message: 'Incorrect link format',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Required field to fill in'],
    validate: {
      validator: (v) => /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/gim.test(v),
      message: 'Incorrect link format',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Required field to fill in'],
  },
  movieId: {
    type: Number,
    required: [true, 'Required field to fill in'],
  },
  nameRU: {
    type: String,
    required: [true, 'Required field to fill in'],
  },
  nameEN: {
    type: String,
    required: [true, 'Required field to fill in'],
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('movie', movieSchema);
