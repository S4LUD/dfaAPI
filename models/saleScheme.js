const mongoose = require("mongoose");

const saleScheme = new mongoose.Schema({
  uid: {
    type: ObjectId,
    required: true,
  },
  load: {
    type: Object,
    required: true,
  },
  simcard: {
    type: Object,
    required: true,
  },
  pocketwifi: {
    type: Object,
    required: true,
  },
});

module.exports = mongoose.model("sale", saleScheme);
