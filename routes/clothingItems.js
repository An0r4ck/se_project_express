const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { token } = require("../middlewares/auth");

// CRUD

// Create (requires authentication)
router.post("/", token, createItem);

// Read

// Read (public)
router.get("/", getItems);

// Update (requires authentication)
router.put("/:itemId/likes", token, likeItem);

// Delete (requires authentication)
router.delete("/:itemId", token, deleteItem);
router.delete("/:itemId/likes", token, dislikeItem);

module.exports = router;
