const ClothingItem = require("../models/clothingItem");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");

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
    return next(new UnauthorizedError("Authentication required"));
  }

  return ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      // Ensure the requester is the owner
      if (item.owner && item.owner.toString() !== req.user._id) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
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
    return next(new UnauthorizedError("Authentication required"));
  }

  const userId = req.user && req.user._id;

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      return res.status(200).send({ item });
    })
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  if (!req.user || !req.user._id) {
    return next(new UnauthorizedError("Authentication required"));
  }

  const userId = req.user && req.user._id;

  return ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: userId } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
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
