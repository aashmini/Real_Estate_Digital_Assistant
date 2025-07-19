const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Sentiment = require("sentiment");

const sentiment = new Sentiment();

// GET reviews for a property
router.get("/", async (req, res) => {
  const { propertyId } = req.query;
  if (!propertyId) return res.status(400).json({ error: "propertyId required" });

  try {
    const reviews = await Review.find({ propertyId }).populate("userId", "name email");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST a new review with sentiment analysis
router.post("/", async (req, res) => {
  const { userId, propertyId, review } = req.body;

  if (!userId || !propertyId || !review)
    return res.status(400).json({ error: "userId, propertyId, and review are required" });

  try {
    // Predict sentiment
    const result = sentiment.analyze(review);
    const sentimentLabel = result.score > 0 ? "positive" : result.score < 0 ? "negative" : "neutral";

    const newReview = new Review({
      userId,
      propertyId,
      review,
      sentiment: sentimentLabel
    });

    const saved = await newReview.save();
    res.json(saved);
  } catch (err) {
    console.error("Review POST error:", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// DELETE a review
router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

module.exports = router;