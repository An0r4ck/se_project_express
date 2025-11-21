const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
} = require("../utils/errors");

const { JWT_SECRET = "dev-secret" } = process.env;

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .select("-password")
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }
  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({ name, avatar, email, password: hash }).then((user) => {
        const userObj = user.toObject();
        delete userObj.password; // never return password
        return res.status(201).send(userObj);
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .select("-password")
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  // Find user by email
  return User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Invalid email or password" });
      }

      // Compare password
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res
            .status(UNAUTHORIZED)
            .send({ message: "Invalid email or password" });
        }

        // Sign JWT and return
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.send({ token });
      });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  // Only update allowed fields
  const update = {};
  if (typeof name !== "undefined") update.name = name;
  if (typeof avatar !== "undefined") update.avatar = avatar;

  if (Object.keys(update).length === 0) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "No valid fields provided to update" });
  }

  return User.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
