const express = require('express');
const sessionRouter = require('./session');
const usersRouter = require('./users');
const podcastsRouter = require('./podcasts');

const router = express.Router();
router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/podcasts', podcastsRouter);

module.exports = router;
