const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    user_tel: {
      type: String,
      required: true,
      min: 11,
      max: 11,
      unique: true,
    },
    comment: {
      type: String,
      required: true,
      min: 1,
      max: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
