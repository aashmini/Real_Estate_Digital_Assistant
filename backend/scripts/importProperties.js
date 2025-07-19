const mongoose = require("mongoose");
const csv = require("csvtojson");
const Property = require("../models/Property");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.error("❌ DB error", err));

const runImport = async () => {
  try {
    // Clean old data
    await Property.deleteMany({});

    const data = await csv().fromFile("data/properties.csv");

    const formatted = data.map((item) => ({
      title: item["Property"] || "Unnamed Property",
      location: item["Location"] || "Unknown",
      price: parseFloat(item["Price"]?.replace(/[^0-9.]/g, "")) || 0,
      area: parseFloat(item["Covered Area"]?.replace(/[^0-9.]/g, "")) || 0,
      bedrooms: parseInt(item["bedroom"]) || 0,
      bathrooms: parseInt(item["Bathroom"]) || 0,
      description: item["Project Name"] || "No description available.",
      image: "https://source.unsplash.com/400x300/?apartment,house", // placeholder
    }));

    await Property.insertMany(formatted);
    console.log("✅ Data imported to MongoDB");
    process.exit();
  } catch (err) {
    console.error("❌ Import failed:", err);
    process.exit(1);
  }
};

runImport();
