const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const HUBSPOT_ACCESS_TOKEN = ""; // Replace with your token

app.get("/api/contacts", async (req, res) => {
  try {
    const response = await axios.get("https://api.hubapi.com/crm/v3/objects/contacts", {
      headers: {
        Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.json(response.data.results || []);
  } catch (error) {
    console.error("Error fetching contacts:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

app.listen(3001, () => {
  console.log("✅ Proxy server running on http://localhost:3001");
});
