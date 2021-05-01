const express = require('express');
const asyncHandler = require('express-async-handler');
const { requireAuth } = require('../../utils/auth');
const { Subscription, Podcast , Episode } = require('../../db/models');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.findAll({where: {userId: req.user.id}, include: Podcast});
    return res.json(subscriptions);
}))

router.get('/:podcastId', requireAuth, asyncHandler(async (req, res) => {
    const subscription = await Subscription.findOne({where: {userId: req.user.id, podcastId: req.params.podcastId}});
    return res.json(subscription);
}))

router.delete('/:podcastId', requireAuth, asyncHandler(async (req, res) => {
    let subscription = await Subscription.findOne({where: {userId: req.user.id, podcastId: req.params.podcastId}})
    if(req.user.id === subscription.userId) {
        await subscription.destroy();
        return res.sendStatus(200);
    }
}))

module.exports = router;