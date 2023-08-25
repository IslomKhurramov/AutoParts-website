const Member = require("../models/Member");
const Product = require("../models/Product");

let userController = module.exports;

userController.home = (req, res) => {
  try {
    console.log("GET: cont/home");
    res.render("home-page");
  } catch (err) {
    console.log("ERROR, cont/home", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

userController.getUserProducts = async (req, res) => {
  try {
    console.log("GET cont.getUserProducts");
    //todo:get user data

    const product = new Product();
    const result = await product.getUserProductsData(res.locals.member);

    res.render(`user-products`, { user_data: result });
  } catch (err) {
    console.log("ERROR: cont.getUserProducts", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

userController.getSignUpMyUserPage = async (req, res) => {
  try {
    console.log("GET cont.getSignUpMyUserPage");
    res.render("sign-up");
  } catch (err) {
    console.log("ERROR: cont.getSignUpMyUserPage", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

userController.signupProcess = async (req, res) => {
  try {
    console.log("POST cont.signupProcess");
    const data = req.body;
    const member = new Member();
    const new_member = await member.signupData(data);

    req.session.member = new_member;
    res.redirect("/resto/products/user");
  } catch (err) {
    console.log("ERROR: cont.signupProcess", err.message);
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
    console.log("POST: cont/loginProcess");
    const data = req.body;
    const member = new Member();
    const result = await member.loginData(data);

    req.session.member = result;
    req.session.save(function () {
      result.mb_type === "ADMIN"
        ? res.redirect("/resto/all-users")
        : res.redirect("/resto/products/user");
    });
  } catch (err) {
    console.log(`ERROR, cont/loginProcess`);
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
