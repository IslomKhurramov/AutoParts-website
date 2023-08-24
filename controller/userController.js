const Member = require("../models/Member");
let userController = module.exports;

userController.getUserProducts = async (req, res) => {
  try {
    console.log("GET cont.getUserProducts");
    //todo:get user data

    res.render("user-products");
  } catch (err) {
    console.log("ERROR: cont.getUserProducts", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

userController.getSignUpMyUserPage = async (req, res) => {
  try {
    console.log("GET cont.getSignUpMyUserPage");
    res.render("signup");
  } catch (err) {
    console.log("ERROR: cont.getSignUpMyUserPage", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

userController.signupProcess = async (req, res) => {
  try {
    console.log("POST cont.signup");
    const data = req.body;
    const member = new Member();
    const new_member = await member.signupData(data);

    req.session.member = new_member;
    res.redirect("/resto/products/user");
  } catch (err) {
    console.log("ERROR: cont.signup", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

userController.getLoginMyUserPage = async (req, res) => {
  try {
    console.log("GET cont.getLoginMyUserPage");
    res.render("login-page");
  } catch (err) {
    console.log("ERROR: cont.getLoginMyUserPage", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

userController.loginProcess = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body;
    const member = new Member();
    const result = await member.loginData(data);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/resto/products/user");
    });
  } catch (err) {
    console.log(`ERROR, cont/login`);
    res.json({ state: "fail", message: err.message });
  }
};

userController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("logout page");
};

userController.validateAuthUser = (req, res, next) => {
  if (req.session?.member?.mb_type === "USER") {
    req.member = req.session.member;
    next();
  } else
    res.json({
      state: "fail",
      message: "only authenticated members with user type",
    });
};

userController.checkSessions = (req, res) => {
  if (req.session?.member) {
    res.json({ state: "succeed", data: req.session.member });
  } else {
    res.json({ state: "fail", message: "you are not authenticated" });
  }
};
