const router = require("express").Router();
const { getCurrentUser, updateUser } = require("../controllers/users");
const { token } = require("../middlewares/auth");

// Protect /users/me routes with auth middleware
router.get("/me", token, getCurrentUser);

router.patch("/me", token, updateUser);

module.exports = router;
