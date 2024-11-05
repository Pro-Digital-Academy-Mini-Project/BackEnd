const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    video_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Video = mongoose.model('Video', videoSchema);
module.exports = Video;
