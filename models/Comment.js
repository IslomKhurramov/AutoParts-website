const Definer = require("../lib/mistake");
const CommentModel = require("../schema/comment.model");
const ReplyModel = require("../schema/reply.comment");
const assert = require("assert");
const Member = require("./Member");
const {
  shapeIntoMongosObjectId,
  lookup_auth_member_liked,
  lookup_auth_member_unliked,
} = require("../lib/config");

class Comment {
  constructor() {
    this.commentModel = CommentModel;
    this.replyModel = ReplyModel;
  }

  async createCommentData(
    memberId,
    comment_content,
    mb_id,
    art_id,
    product_id
  ) {
    try {
      console.log("POst cont.createCommentData");

      console.log(memberId);
      const result = await this.commentModel({
        comment_content,
        mb_id: mb_id,
        product_id: product_id,
        art_id: art_id,
      });
      const saved_comment = await result.save();

      return saved_comment;
    } catch (err) {
      throw err;
    }
  }
  async createReplyData(reply_content, mb_id, parentCommentId) {
    try {
      console.log("POst cont.createCommentData");
      const result = await this.replyModel({
        reply_content,
        mb_id: mb_id,
        parent_comment_id: parentCommentId, // This links the reply to the parent comment
      });
      const saved_comment = await result.save();

      return saved_comment;
    } catch (err) {
      throw err;
    }
  }

  async likeCommentData(commentId) {
    try {
      const comment = await this.commentModel.findById(commentId);
      if (!comment) {
        return res
          .status(404)
          .json({ state: "fail", message: "Comment not found" });
      } else {
        // Increment the likes count
        comment.comment_likes += 1;
      }

      // Save the updated comment
      const result = await comment.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async myCommentsData(member, id) {
    try {
      id = shapeIntoMongosObjectId(id);
      const auth_mb_id = shapeIntoMongosObjectId(member?._id);
      // const matches = { mb_id: mb_id };
      console.log("authhhh", auth_mb_id);

      const result = await this.commentModel
        .aggregate([
          { $match: { product_id: id } },

          // { $sort: { createdAt } },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          {
            $lookup: {
              from: "replies",
              localField: "_id",
              foreignField: "parent_comment_id",
              as: "reply_comments",
            },
          },
          lookup_auth_member_liked(auth_mb_id),
          lookup_auth_member_unliked(auth_mb_id),
        ])
        .exec();

      console.log("result:::", result);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Comment;
