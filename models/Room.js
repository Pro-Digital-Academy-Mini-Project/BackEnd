const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_name: {
        type: String,
        required: true
    },
    room_password: {
        type: String, // 방 비밀번호 (옵션)
        required: false // 필요에 따라 필수로 설정 가능
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    is_private: {
        type: Boolean,
        default: false
    },
    video_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video', // Video 모델을 참조
        required: true,
        
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // User 모델을 참조
    }],
    comments: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // User 모델을 참조
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    timeline_comments: [{
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // User 모델을 참조
        },
        timestamp: {
            type: Number, // 영상의 특정 시간 (초)
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }]
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;