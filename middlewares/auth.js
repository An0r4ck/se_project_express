const jwt = require("jsonwebtoken");

const { UNAUTHORIZED } = require("../utils/errors");

const { JWT_SECRET = "dev-secret" } = process.env;

module.exports.token = (req, res, next) => {
  const { authorization } = req.headers;

  // Expect header like: "Bearer <token>"
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Invalid or expired token" });
  }

  // Attach decoded payload (usually contains user's _id) to request
  req.user = payload;
  return next();
};
