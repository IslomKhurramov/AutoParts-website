console.log("Web Serverni Boshlash");
const express = require("express");
const http = require("http");
const app = express();
const router = require("./router.js");
const router_bssr = require("./router_bssr.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

let session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

//1
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

//2
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 30, //for 30minutes
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(function (req, res, next) {
  res.locals.member = req.session.member;
  next(); //sessiondan keladigan member malumotini browserga yubor degani
});

//3
app.set("views", "views");
app.set("view engine", "ejs");

//4routing
app.use("/resto", router_bssr);
app.use("/", router);

const server = http.createServer(app);

/***SOCKET.IO BACKEND SERVER */
const io = require("socket.io")(server, {
  serveClient: false,
  origins: "*:*",
  transport: ["websocket", "xhr-polling"],
});

let online_users = 0;
io.on("connection", function (socket) {
  online_users++;
  console.log("New user, total:", online_users);

  socket.emit("greetMsg", { text: "welcome" }); //ulangan odam un yoziladigan habar, faqat ulangan odamga habar boradi
  io.emit("infoMsg", { total: online_users }); //bu hammaga egani

  socket.on("disconnect", function () {
    online_users--;
    socket.broadcast.emit("infoMsg", { total: online_users });
    console.log("client disconnected total:", online_users);
  });

  socket.on("createMsg", function (data) {
    console.log(data);
    io.emit("newMsg", data);
  });

  // socket.broadcast.emit(); // ulagan odamdan tashqari qolganlarga malumot yuborish
});
module.exports = server;
