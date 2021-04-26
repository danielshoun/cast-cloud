const express = require('express');
const sessionRouter = require('./session');
const usersRouter = require('./users');

const router = express.Router();
router.use('/session', sessionRouter);
router.use('/users', usersRouter);

module.exports = router;
