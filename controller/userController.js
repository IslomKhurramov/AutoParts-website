const Member = require("../models/Member");
const Product = require("../models/Product");
const assert = require("assert");
const Definer = require("../lib/mistake");
const User = require("../models/User");

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
    assert(req.file, Definer.general_err3);

    const data = req.body;
    data.mb_type = "USER";
    data.mb_image = req.file.path;

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
  try {
    console.log("GET cont.logout");
    req.session.destroy(function () {
      res.redirect("/resto");
    });
  } catch (err) {
    console.log(`ERROR, cont/logout`);
    res.json({ state: "fail", message: err.message });
  }
};

userController.validateAuthUser = (req, res, next) => {
  if (
    req.session?.member?.mb_type === "USER" ||
    req.session?.member?.mb_type === "ADMIN"
  ) {
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

userController.validateAdmin = (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;

    next();
  } else {
    const html = `<script>
             alert("Admin page: Permission denied!");
             window.location.replace("/resto");
          </script>`;
    res.end(html);
  }
};
userController.getAllUsers = async (req, res) => {
  try {
    console.log("GET: cont/getAllUsers");

    const user = new User();
    const users_data = await user.getAllUsersData();
    res.render("all-users", { users_data: users_data });
  } catch (err) {
    console.log(`ERROR, cont/getAllUsers, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
userController.updateUserByAdmin = async (req, res) => {
  try {
    console.log("GET: cont/updateUserByAdmin");

    const user = new User();
    const result = await user.updateUserByAdminData(req.body);
    await res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/updateUserByAdmin, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
