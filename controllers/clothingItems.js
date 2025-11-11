const ClothingItem = require("../models/clothingItem");
const {
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
  BAD_REQUEST,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  return ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" });
    });
};

const getItems = (req, res) => ClothingItem.find({})
    .then((items) => res.status(200).send({ items }))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server" })
    );

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  return ClothingItem.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item)
        return res.status(NOT_FOUND).send({ message: "Item not found" });
      return res.status(200).send();
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
  if (!req.user || !req.user._id) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Authentication required" });
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
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
  if (!req.user || !req.user._id) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Authentication required" });
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
    .catch((err) => {
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
