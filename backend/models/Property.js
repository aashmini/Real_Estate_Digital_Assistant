const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: String,
  location: String,
  price: Number,
  bedrooms: Number,
  bathrooms: Number,
  area: Number,
  type: String,
  image: String,
  description: String,
  brokerId: String,

  postedAt: {
    type: Date,
    default: Date.now,
  },

  // ✅ For visit tracking
  recentlyScheduled: {
    type: Boolean,
    default: false,
  },
  recentScheduledAt: {
    type: Date,
    default: null,
  },

  // ✅ For bookmarking
  bookmarkedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

module.exports = mongoose.model('Property', propertySchema);
