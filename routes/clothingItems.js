const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// CRUD

//Create
router.post("/", createItem);

//Read

router.get("/", getItems);

//Update

router.put("/:itemId", updateItem);
router.put("/:itemId/likes", likeItem);

//Delete

router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
