const express = require('express');
const sessionRouter = require('./session');
const usersRouter = require('./users');
const podcastsRouter = require('./podcasts');
const episodeRouter = require('./episodes');

const router = express.Router();
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/podcasts', podcastsRouter);
router.use('/episodes', episodeRouter)

module.exports = router;
