const express = require("express");
const router_bssr = express.Router();
const userController = require("./controller/userController");

/***********************
 *      BSSR EJS
 ***********************/

router_bssr
  .get("/signup", userController.getSignUpMyUserPage)
  .post("/signup", userController.signupProcess);

router_bssr
  .get("/login", userController.getLoginMyUserPage)
  .post("/login", userController.loginProcess);

router_bssr.get("/logout", userController.logout);

router_bssr.get("/products/user", userController.getUserProducts);
router_bssr.get("/check-me", userController.checkSessions);

module.exports = router_bssr;
