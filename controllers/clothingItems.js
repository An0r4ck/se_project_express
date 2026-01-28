const ClothingItem = require("../models/clothingItem");
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  BAD_REQUEST,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ item }))
    .catch(next);
};

const getItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send({ items }))
    .catch(next);

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!req.user || !req.user._id) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authentication required" });
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      }

      // Ensure the requester is the owner
      if (item.owner && item.owner.toString() !== req.user._id) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }

      // Delete and return 204 No Content
      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(204).send()
      );
    })
    .catch(next);
};

const likeItem = (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authentication required" });
  }

  const userId = req.user && req.user._id;

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((item) => {
      if (!item)
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      return res.status(200).send({ item });
    })
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  if (!req.user || !req.user._id) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authentication required" });
  }

  const userId = req.user && req.user._id;

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: userId } }, // remove _id from the array
    { new: true }
  )
    .then((item) => {
      if (!item)
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      return res.status(200).send({ item });
    })
    .catch(next);
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
