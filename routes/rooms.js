const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Room = require("../models/Room");
const Video = require("../models/Video");
const User = require("../models/User");

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
      res.json({
        roomId : room._id,
        room_name: room.room_name,
        room_video_id: room.video_id.video_url_id,
        is_private: room.is_private,
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/", async (req, res) => {
  try {
    const { room_name, video_url_id, owner_name, room_password, is_private } =
      req.body;

    // 1. video_url_id를 사용하여 Video를 생성 (또는 기존에 있는지 확인)
    let video = await Video.findOne({ video_url_id });
    if (!video) {
      video = new Video({ video_url_id });
      await video.save();
    }

    // 2. owner_name을 사용하여 User를 찾기
    const user = await User.findOne({ username: owner_name });
    if (!user) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // 3. bcrypt로 room_password 저장
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(room_password, salt);

    // 4. Room을 생성하고 video_id와 user_id를 포함하여 저장
    const room = new Room({
      room_name,
      room_password: hashedPassword,
      is_private,
      video_id: video._id,
      owner: user._id,
    });

    await room.save();

    res.status(201).json(room._id);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Server error" });
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
