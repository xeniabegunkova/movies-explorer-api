const router = require('express').Router();

const {
  getMovies,
  createMovies,
  deleteMovieById,
} = require('../controllers/movies');

const { moviesPost, movieDelete } = require('../middlewares/validation');

router.get('/', getMovies);

router.post('/', moviesPost, createMovies);

router.delete('/:movieId', movieDelete, deleteMovieById);

module.exports = router;
