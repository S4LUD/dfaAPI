const mongoose = require("mongoose");

const saleScheme = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  sales: {
    type: Object,
    required: true,
  }
});

module.exports = mongoose.model("sale", saleScheme);
