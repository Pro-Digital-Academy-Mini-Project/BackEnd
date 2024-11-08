const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // User 모델을 참조
    required: true,
  },
  username: {
    type: String,
    requried: true,
  },
  room_id: {
    type: String, //mongoose.Schema.Types.ObjectId,
    // ref: "Room", // Room 모델을 참조
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
