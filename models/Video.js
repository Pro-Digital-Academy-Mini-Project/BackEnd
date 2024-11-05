const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // 길이 (초 단위)
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
