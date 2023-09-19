const { shapeIntoMongosObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const MemberModel = require("../schema/member.model");
const assert = require("assert");
const bcrypt = require("bcryptjs");
const View = require("./View");
const Like = require("./Like");
const Dislike = require("./Dislike");

class Member {
  constructor() {
    this.memberModel = MemberModel;
  }

  async signupData(input) {
    try {
      const salt = await bcrypt.genSalt();
      input.mb_password = await bcrypt.hash(input.mb_password, salt);
      const new_member = new this.memberModel(input);
      let result;
      try {
        result = await new_member.save();
      } catch (mongo_err) {
        throw new Error(Definer.auth_err1);
      }

      result.mb_password = "";

      return result;
    } catch (err) {
      throw err;
    }
  }

  async loginData(input) {
    try {
      const member = await this.memberModel
        .findOne({ mb_nick: input.mb_nick }, { mb_nick: 1, mb_password: 1 })
        .exec();

      assert.ok(member, Definer.auth_err3);

      const isMatch = await bcrypt.compare(
        input.mb_password,
        member.mb_password
      );

      assert.ok(isMatch, Definer.auth_err4);

      return await this.memberModel.findOne({ mb_nick: input.mb_nick }).exec();
    } catch (err) {
      throw err;
    }
  }

  async getChosenMemberData(member, id) {
    try {
      id = shapeIntoMongosObjectId(id);

      if (member) {
        await this.viewChosenItemByMember(member, id, "member");
      }

      const result = await this.memberModel
        .aggregate([
          { $match: { _id: id, mb_status: "ACTIVE" } },
          { $unset: "mb_password" },
        ])
        .exec();

      assert.ok(result, Definer.general_err2);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async viewChosenItemByMember(member, view_ref_id, group_type) {
    try {
      view_ref_id = shapeIntoMongosObjectId(view_ref_id);
      const mb_id = shapeIntoMongosObjectId(member._id);

      const view = new View(mb_id);
      //validation needed
      const isValid = await view.validateChosenTarget(view_ref_id, group_type);
      assert.ok(isValid, Definer.general_err2);

      //logged user has seen target before
      const doesExist = await view.checkViewExistense(view_ref_id);

      if (!doesExist) {
        const result = await view.insertMemberView(view_ref_id, group_type);
        assert.ok(result, Definer.general_err2);
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async likeChosenItemByMember(member, like_ref_id, group_type) {
    try {
      like_ref_id = shapeIntoMongosObjectId(like_ref_id);
      const mb_id = shapeIntoMongosObjectId(member._id);

      const like = new Like(mb_id);
      const isValid = await like.validateTargetItem(like_ref_id, group_type);
      assert.ok(isValid, Definer.general_err2);

      const doesExist = await like.checkLikeExistence(like_ref_id);

      let data = doesExist
        ? await like.removeMemberLike(like_ref_id, group_type)
        : like.insertMemberLike(like_ref_id, group_type);
      assert.ok(data, Definer.general_err1);

      const result = {
        like_group: data.like_group,
        like_ref_id: data.like_ref_id,
        like_status: doesExist ? 0 : 1,
      };
      return result;
    } catch (err) {
      throw err;
    }
  }

  async disLikeChosenItemByMember(member, dislike_ref_id, group_type) {
    try {
      dislike_ref_id = shapeIntoMongosObjectId(dislike_ref_id);
      const mb_id = shapeIntoMongosObjectId(member._id);

      const dislike = new Dislike(mb_id);
      const isValid = await dislike.validateTargetItem(
        dislike_ref_id,
        group_type
      );
      assert.ok(isValid, Definer.general_err2);

      const doesExist = await dislike.checkDislikeExistence(dislike_ref_id);

      let data = doesExist
        ? await dislike.removeMemberDislike(dislike_ref_id, group_type)
        : dislike.insertMemberDislike(dislike_ref_id, group_type);
      assert.ok(data, Definer.general_err1);

      const result = {
        dislike_group: data.dislike_group,
        dislike_ref_id: data.dislike_ref_id,
        dislike_status: doesExist ? 0 : 1,
      };
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Member;
