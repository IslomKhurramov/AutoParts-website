const Definer = require("../lib/mistake");
const ProductModel = require("../schema/product.model");
const assert = require("assert");
const { shapeIntoMongosObjectId } = require("../lib/config");

class Product {
  constructor() {
    this.productModel = ProductModel;
  }

  async addNewProductData(data, user) {
    try {
      console.log(data);
      data.user_mb_id = shapeIntoMongosObjectId(user._id);
      const new_product = new this.productModel(data);
      const result = await new_product.save();

      assert.ok(result, Definer.product_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }
}
module.exports = Product;
