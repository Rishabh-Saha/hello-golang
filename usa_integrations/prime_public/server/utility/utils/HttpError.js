function HttpError({ message = '', status = 500, errorCode = '', data }) {
    this.message = message;
    this.status = status;
    this.errorCode = errorCode;
    this.success = false;
    this.data = data;
}

HttpError.prototype = Error.prototype;

module.exports = HttpError