const router = require("express").Router();
const { validateCardBody, validateId } = require("../middlewares/validation");

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
router.post("/", token, validateCardBody, createItem);

// Read

// Read (public)
router.get("/", getItems);

// Update (requires authentication)
router.put("/:itemId/likes", token, validateId, likeItem);

// Delete (requires authentication)
router.delete("/:itemId", token, validateId, deleteItem);
router.delete("/:itemId/likes", token, validateId, dislikeItem);

module.exports = router;
