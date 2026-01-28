const {
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
} = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(BAD_REQUEST).send({ message: "Invalid data provided" });
  }

  if (err.name === "CastError") {
    return res.status(BAD_REQUEST).send({ message: "Invalid ID format" });
  }

  if (err.name === "DocumentNotFoundError") {
    return res.status(NOT_FOUND).send({ message: "Resource not found" });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(UNAUTHORIZED).send({ message: "Unauthorized access" });
  }

  if (err.name === "ForbiddenError") {
    return res.status(FORBIDDEN).send({ message: "Forbidden access" });
  }

  if (err.name === "ConflictError") {
    return res.status(CONFLICT).send({ message: "Conflict error" });
  }

  res.status(INTERNAL_SERVER_ERROR).send({ message: "An error occurred on the server" });
};

module.exports = errorHandler;
