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
  async createReplyData(reply_content, mb_id, parent_comment_id) {
    try {
      console.log("POst cont.createCommentData");
      mb_id = shapeIntoMongosObjectId(mb_id);
      parent_comment_id = shapeIntoMongosObjectId(parent_comment_id);
      // Use the $lookup stage to fetch member data and add it to the reply document
      const result = await this.replyModel.create({
        reply_content,
        mb_id,
        parent_comment_id: parent_comment_id,
      });

      // Now, you have the reply document with member data
      const replyWithMemberData = await this.replyModel.aggregate([
        {
          $match: { _id: result._id },
        },
        {
          $lookup: {
            from: "members",
            localField: "mb_id",
            foreignField: "_id",
            as: "member_data",
          },
        },
        {
          $unwind: "$member_data",
        },
      ]);

      return replyWithMemberData[0]; // Return the first result (assuming only one reply was created)
    } catch (err) {
      throw err;
    }
  }

  async performAggregation(mb_id) {
    try {
      console.log("mbid::", mb_id);
      mb_id = shapeIntoMongosObjectId(mb_id);
      const result = await this.replyModel
        .aggregate([
          { $match: { mb_id: mb_id } },
          {
            $lookup: {
              from: "members",
              localField: "mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
        ])
        .exec();
      console.log("Aggregation result:", result);
      return result;
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
          {
            $unwind: {
              path: "$reply_comments",
              preserveNullAndEmptyArrays: true, // Preserve comments with no replies
            },
          },
          {
            $lookup: {
              from: "members",
              localField: "reply_comments.mb_id", // Assuming 'mb_id' is the field in replies that corresponds to the member ID
              foreignField: "_id",
              as: "reply_comments.member_data",
            },
          },
          {
            $group: {
              _id: "$_id",
              comment: { $first: "$$ROOT" }, // Preserve the original comment
              reply_comments: { $push: "$reply_comments" }, // Push the updated reply_comments back into an array
            },
          },
          lookup_auth_member_liked(auth_mb_id),
          lookup_auth_member_unliked(auth_mb_id),
        ])
        .exec();
      result.sort((a, b) => a.comment.createdAt - b.comment.createdAt);
      console.log("result:::", result);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Comment;
