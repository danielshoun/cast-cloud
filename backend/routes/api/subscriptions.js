const express = require('express');
const asyncHandler = require('express-async-handler');
const { requireAuth } = require('../../utils/auth');
const { Subscription, Podcast } = require('../../db/models');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.findAll({where: {userId: req.user.id}, include: Podcast});
    return res.json(subscriptions);
}))

router.post('/', requireAuth, asyncHandler(async (req, res) => {
    const subscription = await Subscription.create({
        userId: req.user.id,
        podcastId: req.query.podcastId
    })
    return res.json(subscription);
}))

module.exports = router;