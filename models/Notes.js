const mongoose = require("mongoose");

const notesSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  descryption: {
    type: String,
    required: true,
    unique: true,
  },
  tag: {
    type: String,
    default: "General",
  },
  date: {
    type: String,
    default: Date,
  },
});

module.exports = mongoose.model("notes", notesSchema);
