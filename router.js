const express = require("express");
const router = express.Router();
const memberController = require("./controller/memberController");
const productController = require("./controller/productController");
const orderController = require("./controller/orderController");
const communityController = require("./controller/communityController");
const followController = require("./controller/followController");
const uploader_community = require("./utils/upload-multer")("community");
const uploader_member = require("./utils/upload-multer")("members");
/***********************
 *      REST API
 ***********************/

//MEMBER RELATED ROUTERS
router.post("/signup", memberController.signup);
router.post("/login", memberController.login);
router.get("/logout", memberController.logout);
router.get("/check-me", memberController.checkMyAuthentication);
router.get(
  "/member/:id",
  memberController.retrieveAuthMember,
  memberController.getChosenMember
);

//PRODUCT related ROUTERS
router.post(
  "/products",
  memberController.retrieveAuthMember,
  productController.getAllProducts
);
router.get(
  "/products/:id",
  memberController.retrieveAuthMember,
  productController.getChosenProduct
);

//order related routers
router.post(
  "/orders/create",
  memberController.retrieveAuthMember,
  orderController.createOrder
);
router.get(
  "/orders",
  memberController.retrieveAuthMember,
  orderController.getMyOrders
);
router.post(
  "/orders/edit",
  memberController.retrieveAuthMember,
  orderController.editChosenOrder
);
//COMMUNITY RELATED
router.post(
  "/community/image",
  uploader_community.single("community_image"),
  communityController.imageInsertion
);

router.post(
  "/community/create",
  memberController.retrieveAuthMember,
  communityController.createArticle
);
router.get(
  "/community/articles",
  memberController.retrieveAuthMember,
  communityController.getMemberArticles
);

router.get(
  "/community/target",
  memberController.retrieveAuthMember,
  communityController.getArticles
);
router.get(
  "/community/single-article/:art_id",
  memberController.retrieveAuthMember,
  communityController.getChosenArticle
);
// Following related routers
router.post(
  "/follow/subscribe",
  memberController.retrieveAuthMember,
  followController.subscribe
);
router.post(
  "/follow/unsubscribe",
  memberController.retrieveAuthMember,
  followController.unsubscribe
);
router.get("/follow/followings", followController.getMemberFollowings);

router.get(
  "/follow/followers",
  memberController.retrieveAuthMember, //bizga follow bugan userga shu authenticated user followback boganmi yoqmi tekshirish un kk
  followController.getMemberFollowers
);
module.exports = router;
