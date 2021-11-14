const mongoose = require("mongoose");

const saleScheme = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  overall: {
    type: String,
    required: true,
  },
  distributed: {
    type: String,
    required: true,
  },
  balance: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("sale", saleScheme);
