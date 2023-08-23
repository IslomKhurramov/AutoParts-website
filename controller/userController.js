const Member = require("../models/Member");
let userController = module.exports;

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

    res.json({ state: "succeed", data: new_member });
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

    res.json({ state: "succeed", data: result });
  } catch (err) {
    console.log(`ERROR, cont/login`);
    res.json({ state: "fail", message: err.message });
  }
};

userController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.send("logout page");
};
