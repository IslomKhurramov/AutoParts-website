const express = require("express");
const router_bssr = express.Router();
const userController = require("./controller/userController");

/***********************
 *      BSSR EJS
 ***********************/

router_bssr.get("/signup", userController.getSignUpMyUserPage);
router_bssr.post("/signup", userController.signupProcess);

router_bssr.get("/login", userController.getLoginMyUserPage);
router_bssr.post("/login", userController.loginProcess);

router_bssr.get("/logout", userController.logout);

module.exports = router_bssr;
