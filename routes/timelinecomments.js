const express = require("express");
const router = express.Router();

const TimeLineComment = require("../models/TimeLineComment");
const User = require("../models/User");

router.post("/", async (req, res, next) => {
  const commentUser = req.body.username;
  const user = await User.findOne({ username: commentUser });
  if (!user) {
    return res.status(404).json({ message: "Owner not found" });
  }
  const comment = {
    user_id: user._id,
    username: user.username,
    room_id: req.body.room_id,
    timestamp: req.body.timestamp,
    content: req.body.content,
  };

  TimeLineComment.create(comment)
    .then((timeLineComment) => {
      res.json(timeLineComment);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});

router.get("/:roomId", async (req, res, next) => {
  try {
    const timeLineComments = await TimeLineComment.find({
      room_id: req.params.roomId,
    });

    const returnComments = timeLineComments.map((comment) => {
      return {
        username: comment.username,
        content: comment.content,
        room_id: comment.room_id,
        timestamp: comment.timestamp,
        created_at: comment.created_at,
        likes: comment.likes,
      };
    });
    res.json(returnComments);
  } catch (err) {
    next(err);
  }
});

router.put("/like", async (req, res, next) => {
  const { timestamp, roomId, content } = req.body;
  console.log(timestamp, roomId, content);
  try {
    const updatedComment = await TimeLineComment.findOneAndUpdate(
      { timestamp: timestamp, room_id: roomId, content: content },
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
