var express = require("express");
var router = express.Router();
const { createToken, authenticate } = require("../utils/auth");

const User = require("../models/User");

/* GET users listing. */
router.get("/", function (req, res, next) {
  if (req.session.viewCount) {
    req.session.viewCount += 1;
  } else {
    req.session.viewCount = 1;
  }

  console.log(req.session.viewCount);
  console.log(req.session);
  res.send("respond with a resource");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body; // username 추가
    console.log(req.body);
    const user = await User.signUp(username, email, password); // username을 User.signUp에 전달
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const tokenMaxAge = 60 * 60 * 24 * 3;
    const token = createToken(user, tokenMaxAge);

    user.token = token;

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
      // sameSite: 'none'
    });

    console.log(user);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.all("/logout", (req, res, next) => {
  try {
    res.cookie("authToken", "", { expires: new Date(0) }); // 쿠키 만료 처리
    res.status(200).json({ message: "로그아웃 되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
});

router.get("/protected", authenticate, async (req, res, next) => {
  console.log(req.user);
  res.json({ data: "민감한 데이터" });
});

//user 닉네임을 보내면 user id를 반환하는 식? room 만들 때 user _id 필요함

module.exports = router;
