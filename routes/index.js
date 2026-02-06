const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const errors = require("../utils/errors");
const {
  validateAuthentication,
  validateUserBody,
} = require("../middlewares/validation");
const { login, createUser } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");

router.use("/items", clothingItems);
router.use("/users", userRouter);

router.post("/signin", validateAuthentication, login);
router.post("/signup", validateUserBody, createUser);
router.get("/items", getItems);

// Catch-all for unknown routes — return 404 using the shared constant
router.use((req, res) => {
  res
    .status(errors.NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
