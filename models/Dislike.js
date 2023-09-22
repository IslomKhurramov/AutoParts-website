const MemberModel = require("../schema/member.model");
const ProductModel = require("../schema/product.model");
const BoArticleModel = require("../schema/bo_article.model");
const DislikeModel = require("../schema/dislike.model");
const CommentsModel = require("../schema/comment.model");
const Definer = require("../lib/mistake");

class Dislike {
  constructor(mb_id) {
    this.dislike = DislikeModel;
    this.memberModel = MemberModel;
    this.productModel = ProductModel;
    this.boArticleModel = BoArticleModel;
    this.commentModel = CommentsModel;
    this.mb_id = mb_id;
  }

  async validateTargetItem(id, group_type) {
    try {
      let result;
      switch (group_type) {
        case "member":
          result = await this.memberModel
            .findOne({ _id: id, mb_status: "ACTIVE" })
            .exec();
          break;
        case "product":
          result = await this.productModel
            .findOne({ _id: id, product_status: "PROCESS" })
            .exec();
          break;
        case "comment":
          result = await this.commentModel.findOne({ _id: id }).exec();
          break;
        case "community":
        default:
          result = await this.boArticleModel
            .findOne({ _id: id, art_status: "ACTIVE" })
            .exec();
          break;
      }

      return !!result;
    } catch (err) {
      throw err;
    }
  }

  async checkDislikeExistence(dislike_ref_id) {
    try {
      const dislike = await this.dislike
        .findOne({
          mb_id: this.mb_id,
          dislike_ref_id: dislike_ref_id,
        })
        .exec();
      console.log("like::", dislike);
      return dislike ? true : false;
    } catch (err) {
      throw err;
    }
  }

  async removeMemberDislike(dislike_ref_id, group_type) {
    try {
      const result = await this.dislike
        .findOneAndDelete({
          mb_id: this.mb_id,
          dislike_ref_id: dislike_ref_id,
        })
        .exec();

      await this.modifyItemDisLikeCount(dislike_ref_id, group_type, -1);

      return result;
    } catch (err) {
      throw err;
    }
  }
  async insertMemberDislike(dislike_ref_id, group_type) {
    try {
      const new_dislike = new this.dislike({
        mb_id: this.mb_id,
        dislike_ref_id: dislike_ref_id,
        dislike_group: group_type,
      });
      const result = await new_dislike.save();

      //ModifyTargetLikesCnt
      await this.modifyItemDisLikeCount(dislike_ref_id, group_type, 1);

      return result;
    } catch (err) {
      console.log(err);
      throw new Error(Definer.auth_err1);
    }
  }

  async modifyItemDisLikeCount(dislike_ref_id, group_type, modifier) {
    try {
      switch (group_type) {
        case "product":
          await this.productModel
            .findByIdAndUpdate(
              { _id: dislike_ref_id },
              { $inc: { product_dislikes: modifier } }
            )
            .exec();
          break;
        case "comment":
          await this.commentModel
            .findByIdAndUpdate(
              { _id: dislike_ref_id },
              { $inc: { comment_dislikes: modifier } }
            )
            .exec();
          break;
        case "community":
        default:
          await this.boArticleModel
            .findByIdAndUpdate(
              { _id: dislike_ref_id },
              { $inc: { art_dislikes: modifier } }
            )
            .exec();
          break;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Dislike;
