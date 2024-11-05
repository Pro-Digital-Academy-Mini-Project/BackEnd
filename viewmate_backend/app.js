var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var commentRouter = require('./routes/comments');
var timelinecommentRouter = require('./routes/timelinecomments');
var roomsRouter = require('./routes/rooms');
var videosRouter = require('./routes/videos')

const mongoose = require('./db');

var app = express();
const http = require("http");  //서버의 정보
const server = http.createServer(app);

const { Server } = require("socket.io");
app.io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // 클라이언트 URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use((req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // 모든 도메인 허용
});

// 채팅방 목록
const rooms = ['room1', 'room2', 'room3'];

// 각 채팅방에 대한 네임스페이스 설정
rooms.forEach(room => {
  const namespace = app.io.of(`/${room}`);
  namespace.on('connection', (socket) => {
    console.log(`${room}에 클라이언트가 연결되었습니다:`, socket.id);
    // 메시지 이벤트 처리
    socket.on('sendMessage', (msg) => {
      console.log(`[${room}] 받은 메시지:`, msg);
      namespace.emit('receiveMessage', msg); // 해당 방의 모든 클라이언트에 메시지 전송
    });
    // 연결 끊김 처리
    socket.on('disconnect', () => {
      console.log(`${room} 클라이언트가 연결을 끊었습니다:`, socket.id);
    });
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: "http://localhost:5173"
}));

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
    urlHistory = []
  }

  urlHistory.push(req.url);
  if (urlHistory.length > 10) {
    urlHistory.shift();
  }
  req.session.urlPath = JSON.stringify(urlHistory);
  console.log("Url Path session : ", req.session.urlPath);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/Comment', commentRouter);
app.use('/timelinecomment', timelinecommentRouter);
app.use('/rooms', roomsRouter);
app.use('/videos', videosRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json(res.locals);
});


module.exports = app;
