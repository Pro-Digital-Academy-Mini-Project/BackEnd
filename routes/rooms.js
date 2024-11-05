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

router.post('/', (req, res, next) => {
  console.log(req.body);
  Room.create(req.body).then(room => {
    res.json(room)
  }).catch(err => {
    next(err)
  })
});

module.exports = router;