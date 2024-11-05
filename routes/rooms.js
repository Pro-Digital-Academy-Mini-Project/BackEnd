const express = require('express');
const router = express.Router();

const Room = require('../models/Room');
const Video = require('../models/Video'); // Video 모델 경로

router.get('/', (req, res, next) => {
  Room.find().populate('video_id').then(rooms => {
    res.json(rooms);
  }).catch(err => {
    next(err)
  })
});


// 특정 Room의 상세 정보와 관련된 Video 정보 가져오기
router.get('/:id', (req, res, next) => {
  Room.findById(req.params.id)
    .populate('video_id') // video_id 참조 필드를 Video 정보로 채우기
    .then(room => {
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    })
    .catch(err => {
      next(err);
    });
});
router.post('/', (req, res, next) => {
  console.log(req.body);
  Room.create(req.body).then(room => {
    res.json(room)
  }).catch(err => {
    next(err)
  })
});

module.exports = router;