const { STATUS_CODES, ALERT_MESSAGE } = require('../utils/constants');

module.exports = ((err, req, res, next) => {
  const { statusCode = STATUS_CODES.SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === STATUS_CODES.SERVER_ERROR
        ? ALERT_MESSAGE.SERVER_ERROR
        : message,
    });

  next();
});
