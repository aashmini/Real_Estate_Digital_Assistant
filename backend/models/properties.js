const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// ✅ GET all properties with optional filters
router.get("/", async (req, res) => {
  try {
    const { location, bhk, type, budget, brokerId } = req.query;
    const query = {};

    if (location) query.location = { $regex: location, $options: "i" };
    if (bhk) query.bedrooms = parseInt(bhk);
    if (type) query.type = { $regex: type, $options: "i" };
    if (budget) {
      const maxPrice = parseInt(budget);
      if (!isNaN(maxPrice)) query.price = { $lte: maxPrice };
    }

    if (brokerId) query.postedBy = brokerId;

    const properties = await Property.find(query).sort({ price: -1 });

    // ✅ Auto-reset recentlyScheduled after 10 minutes
    const now = new Date();
    for (const prop of properties) {
      if (prop.recentlyScheduled && prop.recentScheduledAt) {
        const timeDiff = now - new Date(prop.recentScheduledAt);
        if (timeDiff > 10 * 60 * 1000) {
          prop.recentlyScheduled = false;
          prop.recentScheduledAt = null;
          await prop.save();
        }
      }
    }

    res.json(properties);
  } catch (err) {
    console.error("❌ Error fetching properties:", err.message);
    res.status(500).json({ message: "Error fetching properties" });
  }
});

// ✅ POST: Add new property
router.post("/", async (req, res) => {
  try {
    const newProperty = new Property(req.body);
    await newProperty.save();
    res.status(201).json(newProperty);
  } catch (err) {
    console.error("❌ Error saving property:", err.message);
    res.status(500).json({ error: "Failed to save property" });
  }
});

// ✅ GET: Recommended properties based on tags
router.get("/recommend", async (req, res) => {
  const tags = req.query.tags?.split(",") || [];

  const query = {
    $or: [
      ...tags.map(tag => ({ title: { $regex: tag, $options: "i" } })),
      ...tags.map(tag => ({ location: { $regex: tag, $options: "i" } }))
    ]
  };

  try {
    const recommended = await Property.find(query).limit(10);
    res.json(recommended);
  } catch (err) {
    console.error("❌ Recommendation error:", err.message);
    res.status(500).json({ message: "Recommendation error" });
  }
});

module.exports = router;
