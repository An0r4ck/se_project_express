// Common HTTP / application error codes as named constants
// Import like: const errors = require('../utils/errors');
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;

module.exports = {
  NOT_FOUND,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
};
