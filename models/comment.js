const mongoose = require("mongoose");
const commentSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("comment", commentSchema);

module.exports = Comment;
