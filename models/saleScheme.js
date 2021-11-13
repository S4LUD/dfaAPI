const mongoose = require("mongoose");

const saleScheme = new mongoose.Schema({
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
