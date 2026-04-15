const crypto = require('crypto');

function errorHandler(err, req, res, next) {
  const traceId = crypto.randomBytes(6).toString('hex');

  console.error(`[${traceId}]`, {
    message: err.message,
    stack: err.stack,
  });

  res.status(err.code || 500).json({
    message: err.message,
    error_id: traceId,
  });
}

module.exports = errorHandler;