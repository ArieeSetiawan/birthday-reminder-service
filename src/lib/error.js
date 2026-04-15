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

var UnauthorizedError = function(){
    Error.captureStackTrace(this, this.constructor);

    this.code = 403;
    this.message = "You don't have permission to do operation";
}

var PayloadError = function(code, message, payload){

  Error.captureStackTrace(this, this.constructor)

  this.code = code || 400;
  this.payload = payload || {};
  this.message = message;

}

require('util').inherits(UnauthorizedError, HttpError);
require('util').inherits(PayloadError, HttpError);

module.exports.HttpError = HttpError;
module.exports.UnauthorizedError = UnauthorizedError;
module.exports.PayloadError = PayloadError;
