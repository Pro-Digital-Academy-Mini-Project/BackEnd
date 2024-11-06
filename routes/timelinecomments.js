const express = require("express");
const router = express.Router();

const TimeLineComment = require("../models/TimeLineComment");

router.get("/", (req, res, next) => {
  TimeLineComment.findByRoomId()
    .then((timeLineComments) => {
      res.cookie("my-cookie", "cookie-value", {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        httpOnly: true,
        signed: false,
      });
      res.json(timeLineComments);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/", (req, res, next) => {
  console.log(req);
  // token -> user.email -> user._id 로 저장
  const comment = {
    user_id: "672871a44f2b2bf03d7c9192",
    room_id: req.body.room_id,
    timestamp: req.body.timestamp,
    content: req.body.content,
  };
  
  TimeLineComment.create(comment)
    .then((timeLineComment) => {
      res.json(timeLineComment);
    })
    .catch((err) => {
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
          // jwt 토큰을 변환해서 username 가져오기
          username: comment.user_id,
          content: comment.content,
          room_id: comment.room_id,
          timestamp: comment.timestamp,
          created_at: comment.created_at
        }
    })
    res.json(returnComments);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
