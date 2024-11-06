const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Room = require("../models/Room");
const Video = require("../models/Video"); // Video 모델 경로

router.get("/", (req, res, next) => {
  const { page = 1, room_name } = req.query;
  const limit = 4;
  const query = room_name ? { room_name: new RegExp(room_name, "i") } : {};

  Room.find(query)
    .populate("video_id")
    .skip((page - 1) * limit)
    .limit(limit)
    .then((rooms) => {
      res.json(rooms);
    })
    .catch((err) => {
      next(err);
    });
});

// 특정 Room의 상세 정보와 관련된 Video 정보 가져오기
router.get("/:id", (req, res, next) => {
  Room.findById(req.params.id)
    .populate("video_id") // video_id 참조 필드를 Video 정보로 채우기
    .then((room) => {
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    })
    .catch((err) => {
      next(err);
    });
});
router.post("/", async (req, res, next) => {
  try {
    if (req.body.room_password) {
      const salt = await bcrypt.genSalt();
      req.body.room_password = await bcrypt.hash(req.body.room_password, salt);
    }
    const room = await Room.create(req.body);
    res.json(room);
  } catch (err) {
    next(err);
  }
});

router.post("/verify-password", async (req, res, next) => {
  const { roomId, password } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room || !room.room_password) {
      return res.status(400).json({ isValid: false });
    }

    const isValid = await bcrypt.compare(password, room.room_password);
    res.json({ isValid });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
