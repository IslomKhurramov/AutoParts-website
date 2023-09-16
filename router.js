const express = require("express");
const router = express.Router();
const memberController = require("./controller/memberController");
const productController = require("./controller/productController");

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
router.get(
  "/products",
  memberController.retrieveAuthMember,
  productController.getAllProducts
);

module.exports = router;
