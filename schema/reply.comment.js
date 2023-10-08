const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  reply_content: {
    type: String,
    required: true,
  },
  mb_id: {
    type: mongoose.Schema.Types.ObjectId, // Assuming this is a reference to the user who posted the reply
    ref: "User", // Reference to the User model
    required: true,
  },
  parent_comment_id: {
    type: mongoose.Schema.Types.ObjectId, // Assuming this is a reference to the parent comment
    ref: "Comment", // Reference to the Comment model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
