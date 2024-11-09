const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  room_name: {
    type: String,
    required: true,
  },
  room_password: {
    type: String, // 방 비밀번호 (옵션)
    required: false, // 필요에 따라 필수로 설정 가능
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  is_private: {
    type: Boolean,
    default: false,
  },
  flag: {
    type: String,
    default: "1", // 방이 없어지면, default 0 => 나중에 get할 때 flag 1만 가져옴
  },
  video_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video", // Video 모델을 참조
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // User 모델을 참조
  },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
