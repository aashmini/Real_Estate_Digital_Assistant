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
    if (brokerId) query.brokerId = brokerId;

    const properties = await Property.find(query).sort({ price: -1 });

    // ✅ Reset recentlyScheduled after 10 minutes
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

// ✅ POST: Add a new property
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

// ✅ PUT: Update property by ID
router.put("/:id", async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error updating property:", err.message);
    res.status(500).json({ error: "Failed to update property" });
  }
});

// ✅ DELETE: Remove a property
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting property:", err.message);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

module.exports = router;
