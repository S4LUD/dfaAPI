const mongoose = require("mongoose");

const saleScheme = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  load_balance: {
    type: Number,
    required: true,
  },
  simcard_balance: {
    type: Number,
    required: true,
  },
  pocketwifi_balance: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("sale", saleScheme);
