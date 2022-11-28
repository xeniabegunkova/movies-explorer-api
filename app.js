require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { cors } = require('cors');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedErrorHandling = require('./middlewares/centralizedErrorHandling');
const router = require('./routes/index');
const limiter = require('./middlewares/rateLimiter');

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

router.use(cors({
  exposedHeaders: '*',
}));

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.use(limiter);
app.disable('x-powered-by');

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandling);

app.listen(PORT);
