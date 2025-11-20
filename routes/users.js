const router = require("express").Router();
const {
  getUsers,
  createUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users");

router.get("/users", getUsers);

router.get("/users/me", getCurrentUser);

router.post("/users", createUser);

router.patch("/users/me", updateUser);

module.exports = router;
