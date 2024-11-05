const express = require('express');
const router = express.Router();

const Room = require('../models/Room');

router.get('/', (req, res, next) => {
  Room.find().then(rooms => {
    res.json(rooms);
  }).catch(err => {
    next(err)
  })
});

router.get('/:id', (req, res, next)=>{
  Room.findById(req.params.id)
    .populate('video_id') // Video 정보 가져오기
    .populate('participants') // 참가자 정보 가져오기
    .populate('comments') // 댓글 작성자 정보 가져오기
    .populate('timeline_comments') // 타임라인 댓글 작성자 정보 가져오기
    .then(room => {
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    })
    .catch(err => {
      next(err);
    });
})

router.post('/', (req, res, next) => {
  console.log(req.body);
  Room.create(req.body).then(room => {
    res.json(room)
  }).catch(err => {
    next(err)
  })
});

module.exports = router;