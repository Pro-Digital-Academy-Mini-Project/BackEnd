var express = require('express');
var router = express.Router();
const { createToken, authenticate } = require("../utils/auth");

const User = require('../models/User');

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.viewCount) {
    req.session.viewCount += 1;
  } else {
    req.session.viewCount = 1
  }

  console.log(req.session.viewCount);
  console.log(req.session);
  res.send('respond with a resource');
});

router.post("/signup", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await User.signUp(email, password);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
})

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
    });

    console.log(user);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
})

router.all("/logout", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const tokenMaxAge = 60 * 60 * 24 * 3;
    const token = createToken(user, tokenMaxAge);

    user.token = token;

    res.cookie("authToken", token, {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.cookie("authToken", "");

    console.log(user);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(400);
    next(err);
  }
})

router.get("/protected", authenticate, async (req, res, next) => {
  console.log(req.user);
  res.json({ data: "민감한 데이터" });
});

module.exports = router;