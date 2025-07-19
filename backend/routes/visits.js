const express = require("express");
const router = express.Router();
const axios = require("axios");  // ✅ Added axios
const Visit = require("../models/Visit");
const Property = require("../models/Property");
const User = require("../models/User");

const SINGLE_BROKER_ID = "686e7d4832f01fc43eaa0f87";  // Replace with your broker ID
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/e6e2171d288hwyf29p3xdpgqux8s07j5";  // ✅ Your Make webhook

// ✅ POST: Schedule a new visit
router.post("/", async (req, res) => {
  try {
    const { userId, propertyId, date, time } = req.body;

    console.log("🔑 Incoming visit data:", { userId, propertyId, date, time });

    const property = await Property.findById(propertyId);
    if (!property) {
      console.log("❌ Property not found");
      return res.status(404).json({ message: "Property not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const visit = new Visit({
      userId,
      propertyId,
      date,
      time,
      brokerId: SINGLE_BROKER_ID,
      status: "Pending"
    });

    await visit.save();

    property.recentlyScheduled = true;
    property.recentScheduledAt = new Date();
    await property.save();

    // ✅ Send data to Make Webhook (Optional but required for Google Sheets)
    const visitData = {
      userId,
      userName: user.name || "N/A",
      userEmail: user.email || "N/A",
      propertyId,
      propertyTitle: property.title || "N/A",
      propertyLocation: property.location || "N/A",
      date,
      time
    };

    axios.post(MAKE_WEBHOOK_URL, visitData)
      .then(() => console.log("✅ Visit data sent to Make webhook"))
      .catch(error => console.error("❌ Failed to send data to webhook:", error.message));

    res.status(201).json({ message: "Visit scheduled successfully" });

  } catch (err) {
    console.error("❌ Visit scheduling error:", err.message);
    res.status(500).json({ message: "Error scheduling visit" });
  }
});

// ✅ GET all visits
router.get("/", async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate("propertyId")
      .populate("userId");

    res.status(200).json(visits);
  } catch (err) {
    console.error("❌ Error fetching visits:", err.message);
    res.status(500).json({ message: "Error fetching visits" });
  }
});

// ✅ PATCH visit status
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Visit.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error updating visit status:", err.message);
    res.status(500).json({ message: "Error updating visit status" });
  }
});

// ✅ GET visits for specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const visits = await Visit.find({ userId: req.params.userId })
      .populate("propertyId")
      .populate("userId");

    res.status(200).json(visits);
  } catch (err) {
    console.error("❌ Error fetching user visits:", err.message);
    res.status(500).json({ message: "Error fetching user visits" });
  }
});

module.exports = router;