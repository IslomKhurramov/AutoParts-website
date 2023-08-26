const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.product_collection_enums = [
  "Body Components",
  "Bumbpers",
  "Electrical",
  "Heating&Cooling",
  "Lighting",
  "Hardware",
  "Interior",
  "Transmission",
];
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_price_enums = ["USD", "KRW"];

exports.shapeIntoMongosObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};
