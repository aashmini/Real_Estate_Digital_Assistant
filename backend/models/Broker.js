const mongoose = require("mongoose");

const brokerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  company: String,
  role: { type: String, default: "broker" },
});

module.exports = mongoose.model("Broker", brokerSchema);
