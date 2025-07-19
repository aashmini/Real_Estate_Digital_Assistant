const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  review: { type: String, required: true },
  sentiment: { type: String, enum: ["positive", "negative", "neutral"], default: "neutral" }
});

module.exports = mongoose.model("Review", reviewSchema);