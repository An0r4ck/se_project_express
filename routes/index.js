const router = require("express").Router();
const clothingItem = require("./clothingItem");
const { INTERNAL_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(INTERNAL_ERROR).send({ message: "Router not found" });
});

const userRouter = require("./users");

router.use("/users", userRouter);

module.exports = router;
