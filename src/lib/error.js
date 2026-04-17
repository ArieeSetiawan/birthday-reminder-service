var HttpError = function(code, message, meta) {

    Error.captureStackTrace(this, this.constructor);

    this.message = message;
    this.code = code || 500;
    this.meta = meta || {};

    if (!this.message){
      switch (this.code){
        case 400:
          this.message = "Bad request";
          break;
        case 401:
          this.message = "Unauthorized";
          break;
        case 403:
          this.message = "Forbidden";
          break;
        case 404:
          this.message = "Not found";
          break;
        case 500:
          this.message = "Internal server error";
          break;
      }
    }
}
require('util').inherits(HttpError, Error);

module.exports.HttpError = HttpError;