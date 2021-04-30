const express = require('express');
const sessionRouter = require('./session');
const usersRouter = require('./users');
const podcastsRouter = require('./podcasts');
const episodeRouter = require('./episodes');
const commentRouter = require('./comments');
const reviewRouter = require('./reviews');

const router = express.Router();
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/podcasts', podcastsRouter);
router.use('/episodes', episodeRouter);
router.use('/comments', commentRouter);
router.use('/reviews', reviewRouter);

module.exports = router;
