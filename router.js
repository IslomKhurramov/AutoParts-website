const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.send("home page");
});
router.get("/menu", (req, res) => {
  res.send("menu page");
});
router.get("/community", (req, res) => {
  res.send("community page");
});

module.exports = router;
