var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var commentRouter = require("./routes/comments");
var timelinecommentRouter = require("./routes/timelinecomments");
var roomsRouter = require("./routes/rooms");
var videosRouter = require("./routes/videos");

const mongoose = require("./db");

var app = express();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"], // 허용할 도메인
    credentials: true, // 쿠키를 사용할 수 있게 설정
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "<my-secret>",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use((req, res, next) => {
  let urlHistory = req.session.urlPath;
  if (urlHistory) {
    urlHistory = JSON.parse(urlHistory);
  } else {
    urlHistory = [];
  }

  urlHistory.push(req.url);
  if (urlHistory.length > 10) {
    urlHistory.shift();
  }
  req.session.urlPath = JSON.stringify(urlHistory);
  console.log("Url Path session : ", req.session.urlPath);
  next();
});

app.use("/api", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/Comment", commentRouter);
app.use("/api/timelinecomment", timelinecommentRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/videos", videosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json(res.locals);
});

module.exports = app;
