const express = require("express");
const router = express.Router();
const memberController = require("./controller/memberController");

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

//OTHER ROUTERS
router.get("/menu", (req, res) => {
  res.send("menu page");
});
router.get("/community", (req, res) => {
  res.send("community page");
});

module.exports = router;
