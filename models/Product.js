const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");
const assert = require("assert");
const {
  shapeIntoMongosObjectId,
  product_collection_id_enums,
  lookup_auth_member_liked,
  lookup_auth_member_unliked,
} = require("../lib/config");
const Member = require("./Member");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async getAllProductsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongosObjectId(member?._id);
      // console.log("authhhh", auth_mb_id);

      let match = {
        product_status: "PROCESS",
      };
      if (data.product_collection) {
        match["user_mb_id"] = shapeIntoMongosObjectId(data.user_mb_id);
        match["product_collection"] = data?.product_collection;
      }
      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }
          : { [data.order]: -1 };

      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "product_id",
              as: "product_comments",
            },
          },
          lookup_auth_member_liked(auth_mb_id),
          lookup_auth_member_unliked(auth_mb_id),
        ])
        .exec();

      //TODO: auth user liked or not

      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAllProductsElectricData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongosObjectId(member?._id);

      let match = {
        product_status: "PROCESS",
        product_collection_id: data.product_collection_id,
      };

      if (data.product_collection) {
        // match["user_mb_id"] = shapeIntoMongosObjectId(data.user_mb_id);
        match["product_collection"] = data.product_collection;
        //faqatgina bitta userga tegishli productni chiqarish un
      }
      const sort =
        data.order === "product_price"
          ? { [data.order]: 1 }
          : { [data.order]: -1 };

      const result = await this.productModel
        .aggregate([
          { $match: match },
          { $sort: sort },
          { $skip: (data.page * 1 - 1) * data.limit },
          { $limit: data.limit * 1 },
          {
            $lookup: {
              from: "comments",
              localField: "_id",
              foreignField: "product_id",
              as: "product_comments",
            },
          },
          lookup_auth_member_liked(auth_mb_id),
          lookup_auth_member_unliked(auth_mb_id),
        ])
        .exec();

      //TODO: auth user liked or not

      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenProductData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongosObjectId(member?._id);
      id = shapeIntoMongosObjectId(id);

      if (member) {
        const member_obj = new Member();
        member_obj.viewChosenItemByMember(member, id, "product");
      }

      const result = await this.productModel
        .aggregate([
          { $match: { _id: id, product_status: "PROCESS" } },
          lookup_auth_member_liked(auth_mb_id),
          lookup_auth_member_unliked(auth_mb_id),
        ])
        .exec();
      //TODO: auth user liked or not

      assert.ok(result, Definer.general_err1);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  async getUserProductsData(mb_id, inquery) {
    try {
      mb_id = shapeIntoMongosObjectId(mb_id);

      console.log("mb_id get user", mb_id);

      const page = inquery["page"] ? inquery["page"] * 1 : 1;
      console.log("page", page);
      const limit = inquery["limit"] ? inquery["limit"] * 1 : 5;

      const result = await this.productModel
        .aggregate([
          { $match: { user_mb_id: mb_id, product_status: "PROCESS" } },
          { $sort: { createdAt: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "members",
              localField: "user_mb_id",
              foreignField: "_id",
              as: "member_data",
            },
          },
          { $unwind: "$member_data" },
        ])
        .exec();
      assert.ok(result, Definer.general_err1);
      //   console.log(result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getUserProductsInfoData(id) {
    try {
      id = shapeIntoMongosObjectId(id);
      const result = await this.productModel.find({
        product_collection_id: product_collection_id_enums,
        user_mb_id: id,
      });
      assert.ok(result, Definer.general_err1);
      //   console.log(result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getAdminProductsData(member) {
    try {
      member._id = shapeIntoMongosObjectId(member._id);
      const result = await this.productModel.find({
        user_mb_id: member._id,
      });
      assert.ok(result, Definer.general_err1);
      console.log(result);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async addNewProductData(data, user) {
    try {
      //   console.log(data);
      data.user_mb_id = shapeIntoMongosObjectId(user._id);
      const new_product = new this.productModel(data);
      const result = await new_product.save();

      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async editChosenProductData(id, edited_data, user_id) {
    try {
      id = shapeIntoMongosObjectId(id);
      user_id = shapeIntoMongosObjectId(user_id);

      const result = await this.productModel
        .findOneAndUpdate(
          {
            _id: id,
            user_mb_id: user_id,
          },
          edited_data,
          {
            runValidators: true,
            lean: true,
            returnDocument: "after",
          }
        )
        .exec();
      assert.ok(result, Definer.general_err1);
      //   console.log(result);
      return result;
    } catch (err) {
      throw err;
    }
  }
  async searchProductData(key) {
    try {
      const result = await this.productModel
        .find({
          $or: [
            {
              product_name: { $regex: key, $options: "i" },
            },
            {
              product_collection_model: { $regex: key, $options: "i" },
            },
          ],
        })
        .exec();
      assert.ok(result, Definer.general_err1);
      // console.log(result);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Product;
