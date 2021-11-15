const mongoose = require("mongoose");

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile_number: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  area_located: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  idm: {
    type: String,
    default: Math.floor(Math.random() * 90000) + 10000,
  },
  ustat: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "dsp",
  },
});

module.exports = mongoose.model("user", userScheme);
