const mongoose = require("mongoose");

const timeScheme = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  data_time: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("meeting", timeScheme);
