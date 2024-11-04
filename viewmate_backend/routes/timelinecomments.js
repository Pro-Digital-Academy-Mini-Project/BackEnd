const express = require('express');
const router = express.Router();

const TimeLineComment = require('../models/TimeLineComment');


router.get('/', (req, res, next) => {
  TimeLineComment.find().then(timeLineComments => {
    res.cookie("my-cookie", "cookie-value", {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      httpOnly: true,
      signed: false
    });
    res.json(timeLineComments);
  }).catch(err => {
    next(err)
  })
});

router.post('/', (req, res, next) => {
  console.log(req.body);
  TimeLineComment.create(req.body).then(timeLineComment => {
    res.json(timeLineComment)
  }).catch(err => {
    next(err)
  })
});

const Comment = require('../models/Comment');

router.get('/:id/comment', (req, res, next) => {
  console.log(req.params);
  Comment.find({
    timeLineComment: req.params.id
  }).then(comments => {
    res.json(comments);
  }).catch(err => {
    next(err);
  })
});

router.post('/:id/comment', (req, res, next) => {
  console.log(req.body);

  Comment.create({
    timeLineComment: req.params.id,
    author: req.body.author,
    content: req.body.content
  }).then(comment => {
    res.json(comment)
  }).catch(err => {
    next(err)
  })
});


router.get('/:id', (req, res, next) => {
  TimeLineComment.findById(req.params.id).then(timeLineComment => {
    let boardHistory = req.session.boardPath;
    if (boardHistory) {
      boardHistory = JSON.parse(boardHistory);
    } else {
      boardHistory = []
    }

    boardHistory.push(timeLineComment.title);
    if (boardHistory.length > 10) {
      boardHistory.shift();
    }
    req.session.boardPath = JSON.stringify(boardHistory);
    console.log("TimeLineComment Path session : ", req.session.boardPath);
    res.send(timeLineComment);
  }).catch(err => {
    next(err);
  })
});


module.exports = router;