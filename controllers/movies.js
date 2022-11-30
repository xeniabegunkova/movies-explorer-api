const Movies = require('../models/movie');
const {
  STATUS_CODES,
  ALERT_MESSAGE,
} = require('../utils/constants');
const NotFound = require('../errors/NotFound');
const Forbbiden = require('../errors/Forbidden');
const BadReq = require('../errors/BadRequest');

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movies.find({ owner })
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(next);
};

const createMovies = (req, res, next) => {
  Movies.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(STATUS_CODES.WELL_DONE).send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadReq(ALERT_MESSAGE.GET_CARDS_ERROR));
      }
      return next(err);
    });
};

const deleteMovieById = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFound(ALERT_MESSAGE.DELETE_CARDSID_ERROR);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbbiden(ALERT_MESSAGE.REFUSAL_TO_DELETE);
      }
      return Movies.findByIdAndRemove(req.params.movieId)
        .then((removedMovie) => res.send(removedMovie));
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovies,
  deleteMovieById,
};
