const mongoose = require("mongoose");

const saleScheme = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  load: {
    type: Array,
    required: true,
  },
  simcard: {
    type: Array,
    required: true,
  },
  pocketwifi: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("sale", saleScheme);
