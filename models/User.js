const assert = require("assert");
const MemberModel = require("../schema/member.model");
const Definer = require("../lib/mistake");
const {
  shapeIntoMongosObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const Member = require("./Member");

class User {
  constructor() {
    this.memberModel = MemberModel;
  }

  async getAllUsersData() {
    try {
      const result = await this.memberModel
        .find({
          mb_type: "USER",
        })
        .exec();

      assert(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateUserByAdminData(update_data) {
    try {
      const id = shapeIntoMongosObjectId(update_data?.id);
      const result = await this.memberModel
        .findByIdAndUpdate({ _id: id }, update_data, {
          runValidators: true,
          lean: true,
          returnDocument: "after",
        })
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = User;
