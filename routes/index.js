const router = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const errors = require("../utils/errors");

router.use("/items", clothingItems);
router.use("/users", userRouter);

// Catch-all for unknown routes — return 404 using the shared constant
router.use((req, res) => {
  res
    .status(errors.NOT_FOUND)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
