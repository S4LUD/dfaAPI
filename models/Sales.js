const mongoose = require("mongoose");

const moveScheme = new mongoose.Schema({
  move: {
    type: String,
    required: true,
  },
  csteps: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("move", moveScheme);
