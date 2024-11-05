const express = require('express');
const router = express.Router();

const Video = require('../models/Video');

router.get('/', (req, res, next) => {
  Video.find().then(videos => {
    res.json(videos);
  }).catch(err => {
    next(err)
  })
});

router.post('/', (req, res, next) => {
  console.log(req.body);
  Video.create(req.body).then(video => {
    res.json(video)
  }).catch(err => {
    next(err)
  })
});

module.exports = router;