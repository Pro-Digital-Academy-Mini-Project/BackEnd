const mongoose = require('mongoose');

const timelineCommentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User 모델 참조
        required: true
    },
    room_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room', // Room 모델 참조
        required: true,
        index: true
    },
    timestamp: {
        type: Number, // 영상의 특정 시간 (밀리초 단위)
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const TimelineComment = mongoose.model('TimelineComment', timelineCommentSchema);
module.exports = TimelineComment;