const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.ordinary_enums = ["Y", "N"];
exports.product_collection_enums = [
  "Body Components",
  "Bumpers",
  "Heating",
  "Lighting",
  "Hardware",
  "Interior",
  "Transmission",
];
exports.product_collection_id_enums = ["electric", "manual transmission"];
exports.product_collection_model_enums = [
  "BMW",
  "Mersedez-Benz",
  "Audi",
  "KIA",
  "Hyundai",
  "Genesis",
  "Chevrolet",
  "Toyota",
  "Honda",
  "Tesla",
  "Any",
];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_price_enums = ["USD", "KRW"];

exports.like_view_group_list = ["product", "community", "member"];
exports.board_id_enums = ["celebrity", "review", "story"];

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.shapeIntoMongosObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};
