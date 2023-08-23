console.log("Web Serverni Boshlash");
const express = require("express");
const app = express();
const router = require("./router.js");
const router_bssr = require("./router_bssr.js");

//1
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//2

//3
app.set("views", "views");
app.set("view engine", "ejs");

//4routing
app.use("/resto", router_bssr);
app.use("/", router);

module.exports = app;
