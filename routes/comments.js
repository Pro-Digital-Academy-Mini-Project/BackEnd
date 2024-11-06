var express = require("express");
var router = express.Router();

const Comment = require("../models/Comment");

router.get("/:roomId", async function (req, res, next) {
  try {
    const totalComments = await Comment.find({
      room_id: req.params.roomId,
    });

    const returnComments = totalComments.map((comment) => {
      return {
        username: comment.user_id,
        content: comment.content,
        room_id: comment.room_id,
        created_at: comment.created_at,
      };
    });
    res.json(returnComments);
  } catch (err) {
    next(err);
  }
});

router.post("/:roomId", async function (req, res, next) {
  console.log(req);
  // token -> user.email -> user._id 로 저장
  const comment = {
    user_id: "672306a63c7aefa987bcf5b3",
    room_id: req.body.room_id,
    content: req.body.content,
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
