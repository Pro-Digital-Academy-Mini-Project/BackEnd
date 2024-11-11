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
        likes: comment.likes,
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

router.put("/like", async (req, res, next) => {
  const { created_at, roomId } = req.body;
  try {
    console.log("created_at ", created_at);
    const updatedComment = await Comment.findOneAndUpdate(
      { created_at: created_at, room_id: roomId },
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
    }

    res.json(updatedComment);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
