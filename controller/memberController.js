let memberController = module.exports;
const Member = require("../models/Member");
const jwt = require("jsonwebtoken");
const assert = require("assert");
const Definer = require("../lib/mistake");
const commentModel = require("../schema/comment.model");
const replyModel = require("../schema/reply.comment");

memberController.signup = async (req, res) => {
  try {
    console.log("POST cont.signup");
    const data = req.body;
    const member = new Member();
    const new_member = await member.signupData(data);

    //TODO: authenticate based on jwt
    const token = memberController.createToken(new_member);

    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: true,
    });

    res.json({ state: "succeed", data: new_member });
  } catch (err) {
    console.log("ERROR: cont.signup", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.login = async (req, res) => {
  try {
    console.log("POST: cont/login");
    const data = req.body;
    const member = new Member();
    const result = await member.loginData(data);

    //TODO: authenticate based on jwt
    const token = memberController.createToken(result);

    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: true,
    });

    res.json({ state: "succeed", data: result });
  } catch (err) {
    console.log(`ERROR, cont/login`);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.logout = (req, res) => {
  console.log("GET cont.logout");
  res.cookie("access_token", null, { maxAge: 0, httpOnly: true });
  res.json({ state: "succeed", data: "logout syccessfully" });
};

memberController.createToken = (result) => {
  try {
    const upload_data = {
      _id: result._id,
      mb_nick: result.mb_nick,
      mb_type: result.mb_type,
    };

    const token = jwt.sign(upload_data, process.env.SECRET_TOKEN, {
      expiresIn: "6h",
    });

    assert.ok(token, Definer.auth_err2);
    return token;
  } catch (err) {
    throw err;
  }
};

memberController.checkMyAuthentication = (req, res) => {
  try {
    console.log("GET cont.checkMyAuthentication");
    let token = req.cookies["access_token"];
    console.log(token);

    const member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
    assert.ok(member, Definer.auth_err2);

    res.json({ state: "succeed", data: member });
  } catch (err) {
    throw err;
  }
};

memberController.getChosenMember = async (req, res) => {
  try {
    console.log("GET cont.getChosenMember");
    const id = req.params.id;

    const member = new Member();
    const result = await member.getChosenMemberData(req.member, id);

    res.json({ state: "succeed", data: result });
  } catch (err) {
    console.log("GET cont.getChosenMember", err.message);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.retrieveAuthMember = (req, res, next) => {
  try {
    const token = req.cookies["access_token"];
    req.member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
    next();
  } catch (err) {
    console.log("GET cont.getChosenMember", err.message);
    next();
  }
};

memberController.likeMemberChosen = async (req, res) => {
  try {
    console.log("POst cont.likeMemberChosen");
    assert.ok(req.member, Definer.auth_err5);

    const member = new Member();
    const like_ref_id = req.body.like_ref_id;
    const group_type = req.body.group_type;

    const result = await member.likeChosenItemByMember(
      req.member,
      like_ref_id,
      group_type
    );

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/likeMemberChosen, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.disLikeMemberChosen = async (req, res) => {
  try {
    console.log("POst cont.disLikeMemberChosen");
    assert.ok(req.member, Definer.auth_err5);

    const member = new Member();
    const dislike_ref_id = req.body.dislike_ref_id;
    const group_type = req.body.group_type;

    const result = await member.disLikeChosenItemByMember(
      req.member,
      dislike_ref_id,
      group_type
    );

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, cont/disLikeMemberChosen, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

/********************************
 * COMMENT RELATED METHODS
 ********************************/

memberController.createComment = async (req, res) => {
  try {
    console.log("POst cont.createComment");
    assert.ok(req.member, Definer.auth_err5);

    const { comment_content, mb_id, art_id, product_id } = req.body;

    const new_comment = new commentModel({
      comment_content,
      mb_id: mb_id,
      product_id: product_id,
      art_id: art_id,
    });

    const saved_comment = await new_comment.save();

    res.json({ state: "success", data: saved_comment });
  } catch (err) {
    console.log(`ERROR, cont/createComment, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
memberController.createReply = async (req, res) => {
  try {
    console.log("POST cont.createReply");
    assert.ok(req.member, Definer.auth_err5);

    const { reply_content, mb_id, parent_comment_id } = req.body;

    const new_reply = new replyModel({
      reply_content,
      mb_id: mb_id,
      parent_comment_id: parent_comment_id, // This links the reply to the parent comment
    });

    const saved_reply = await new_reply.save();

    res.json({ state: "success", data: saved_reply });
  } catch (err) {
    console.log(`ERROR, cont/createReply, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
