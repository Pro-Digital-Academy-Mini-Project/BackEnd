var express = require("express");
var router = express.Router();

const Comment = require("../models/Comment");
const User = require("../models/User");

router.get("/:roomId", async function (req, res, next) {
  try {
    const totalComments = await Comment.find({
      room_id: req.params.roomId,
    });
    const returnComments = totalComments.map((comment) => {
      return {
        username: comment.username,
        room_id: comment.room_id,
        content: comment.content,
        created_at: comment.created_at,
      };
    });
    res.json(returnComments);
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  const commentUser = req.body.username;
  const user = await User.findOne({ username: commentUser });
  if (!user) {
    return res.status(404).json({ message: "Owner not found" });
  }
  const comment = {
    user_id: user._id,
    username: user.username,
    room_id: req.body.room_id,
    content: req.body.content,
    created_at: req.body.created_at,
  };

  Comment.create(comment)
    .then((comment) => {
      res.json(comment);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
