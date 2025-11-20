const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemsSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  weather: { type: String, required: true, enum: ["hot", "warm", "cold"] },
  imageUrl: {
    type: String,
    required: [true, "The image URL field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("clothingItem", clothingItemsSchema);
