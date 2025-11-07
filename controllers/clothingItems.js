const clothingItem = require("../models/clothingItem");
const { INTERNAL_ERROR } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({ name, weather, imageUrl })
    .then((item) => res.send({ data: item }))
    .catch((err) => res.status(INTERNAL_ERROR).send({ message: err.message }));
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send({ items }))
    .catch((err) => res.status(INTERNAL_ERROR).send({ message: err.message }));
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  clothingItem
    .findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => {
      res
        .status(200)
        .send({ item })
        .catch((err) => {
          res.status(INTERNAL_ERROR).send({ message: err.message });
        });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(204).send({ message: err.message });
    })
    .catch((err) => {
      res.status(INTERNAL_ERROR).send({ message: err.message });
    });
};

const likeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  );

const dislikeItem = (req, res) =>
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  );

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
