const mongoose = require("mongoose");
const { dislike_view_group_list, board_id_enums } = require("../lib/config");
const Schema = mongoose.Schema;

const dislikeSchema = new mongoose.Schema(
  {
    mb_id: { type: Schema.Types.ObjectId, required: true },
    dislike_ref_id: { type: Schema.Types.ObjectId, required: true },
    dislike_group: {
      type: String,
      required: true,
      enum: {
        values: dislike_view_group_list,
      },
    },
    bo_id: {
      type: String,
      required: false,
      enum: {
        values: board_id_enums,
      },
    },
  },
  { timestamps: { createdAt: true } }
);
module.exports = mongoose.model("Dislike", dislikeSchema);
