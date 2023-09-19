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
exports.dislike_view_group_list = ["product", "community", "member"];
exports.board_id_enums = ["celebrity", "review", "story"];

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.board_id_enum_list = ["celebrity", "review", "story"];
exports.board_article_status_enum_list = ["ACTIVE", "DELETED"];

exports.shapeIntoMongosObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else return target;
};

exports.lookup_auth_member_following = (mb_id, origin) => {
  const follow_id = origin === "follows" ? "$subscriber_id" : "$_id";
  return {
    $lookup: {
      from: "follows",
      let: {
        local_follow_id: follow_id,
        local_subscriber_id: mb_id,
        nw_my_followings: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$follow_id", "$$local_follow_id"] },
                { $eq: ["$subscriber_id", "$$local_subscriber_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            subscriber_id: 1,
            follow_id: 1,
            my_following: "$$nw_my_followings",
          },
        },
      ],
      as: "me_followed",
    },
  };
};

exports.lookup_auth_member_liked = (mb_id) => {
  return {
    $lookup: {
      from: "likes",
      let: {
        local_liken_item_id: "$_id",
        local_mb_id: mb_id,
        nw_my_favorite: true,
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$like_ref_id", "$$local_liken_item_id"] },
                { $eq: ["$mb_id", "$$local_mb_id"] },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            mb_id: 1,
            like_ref_id: 1,
            my_favorite: "$$nw_my_favorite",
          },
        },
      ],
      as: "me_liked",
    },
  };
};
