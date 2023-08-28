const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");
const assert = require("assert");
const { shapeIntoMongosObjectId } = require("../lib/config");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async getUserProductsData(member) {
    try {
      member._id = shapeIntoMongosObjectId(member._id);
      const result = await this.productModel.find({
        user_mb_id: member._id,
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
}
module.exports = Product;
