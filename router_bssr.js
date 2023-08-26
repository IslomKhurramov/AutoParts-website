const express = require("express");
const router_bssr = express.Router();
const userController = require("./controller/userController");
const productController = require("./controller/productController");
const uploader_product = require("./utils/upload-multer")("products");
const uploader_users = require("./utils/upload-multer")("users");

/***********************
 *      BSSR EJS
 ***********************/
router_bssr.get("/", userController.home);

router_bssr
  .get("/sign-up", userController.getSignUpMyUserPage)
  .post(
    "/sign-up",
    uploader_users.single("user_img"),
    userController.signupProcess
  );
router_bssr
  .get("/login", userController.getLoginMyUserPage)
  .post("/login", userController.loginProcess);
router_bssr.get("/logout", userController.logout);
router_bssr.get("/check-me", userController.checkSessions);

router_bssr.get("/products/user", userController.getUserProducts);

router_bssr.post(
  "/products/create",
  userController.validateAuthUser,
  uploader_product.array("product_images", 5),
  productController.addNewProduct
);

router_bssr.post(
  "/products/edit/:id",
  userController.validateAuthUser,
  productController.editChosenProduct
);

module.exports = router_bssr;
