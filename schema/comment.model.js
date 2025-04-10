const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    comment_content: { type: String, required: true },
    mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
    },
    art_id: {
      type: Schema.Types.ObjectId,
      ref: "Community",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    comment_likes: {
      type: Number,
      default: 0,
    },
    comment_dislikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
