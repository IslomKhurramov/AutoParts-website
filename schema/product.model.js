const mongoose = require("mongoose");
const {
  product_collection_enums,
  product_status_enums,
  product_price_enums,
} = require("../lib/config");
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    product_collection: {
      type: String,
      required: true,
      enum: {
        values: product_collection_enums,
        messgae: "{VALUE} is not among permitted enum values",
      },
    },

    product_status: {
      type: String,
      required: false,
      default: "PROCESS",
      enum: {
        values: product_status_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_price_status: {
      type: String,
      required: false,
      default: "KRW",
      enum: {
        values: product_price_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },
    product_discount: {
      type: Number,
      required: false,
      default: 0,
    },
    product_left_cnt: {
      type: Number,
      required: true,
    },

    product_description: {
      type: String,
      required: true,
    },
    product_images: {
      type: Array,
      required: false,
      default: [],
    },
    product_likes: {
      type: Number,
      required: false,
      default: 0,
    },
    product_views: {
      type: Number,
      required: false,
      default: 0,
    },
    user_mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
  },
  { timestamps: true }
);

// productSchema.index(
//   { user_mb_id: 1, product_name: 1, product_size: 1, product_volume: 1 },
//   { unique: true }
// );

module.exports = mongoose.model("Product", productSchema);
