const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require("express-rate-limit");
require('dotenv').config();
const { body, validationResult } = require("express-validator");
const User = require("./models/User"); // Adjust the path if needed

const app = express();

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// ✅ Middleware
app.use(cors());
app.use(express.json());
const Broker = require("./models/Broker"); // Adjust path if needed

// ✅ Routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const visitRoutes = require('./routes/visits');
const reviewRoutes = require('./routes/reviews'); // Make sure this file exists

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/reviews', reviewRoutes);

// ✅ HubSpot Routes
app.get("/api/contacts", async (req, res) => {
  try {
    const response = await axios.get("https://api.hubapi.com/crm/v3/objects/contacts", {
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Error fetching contacts:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

app.post(
  "/api/contacts",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("firstname").trim().notEmpty().withMessage("First name is required"),
    body("lastname").trim().notEmpty().withMessage("Last name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, firstname, lastname } = req.body;

    try {
      const response = await axios.post(
        "https://api.hubapi.com/crm/v3/objects/contacts",
        {
          properties: { email, firstname, lastname },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json(response.data);
    } catch (error) {
      console.error("❌ Error creating contact:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to create contact" });
    }
  }
);

// ✅ Update contact
app.patch("/api/contacts/:id", async (req, res) => {
  try {
    const { email, firstname, lastname } = req.body;
    const contactId = req.params.id;

    const response = await axios.patch(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        properties: { email, firstname, lastname },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("❌ Error updating contact:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to update contact" });
  }
});

// ✅ Delete contact
app.delete("/api/contacts/:id", async (req, res) => {
  try {
    const contactId = req.params.id;

    await axios.delete(
      `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
        },
      }
    );

    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    console.error("❌ Error deleting contact:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to delete contact" });
  }
});
app.patch("/api/brokers/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid broker ID" });
    }

    const updatedBroker = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!updatedBroker) {
      return res.status(404).json({ message: "Broker not found" });
    }

    res.json(updatedBroker);
  } catch (err) {
    console.error("Error updating broker:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
