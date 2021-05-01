const express = require('express');
const asyncHandler = require('express-async-handler')
const {requireAuth} = require("../../utils/auth");
const { Comment, User, EpisodeProgress, Episode, Podcast, Subscription } = require('../../db/models');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.findAll({
        where: {userId: req.user.id},
        include: {
            model: Podcast,
            include: {
                model: Episode,
                include: {
                    model: EpisodeProgress,
                    required: false
                }
            }
        }});
    const episodes = [];
    subscriptions.forEach((subscription) => {
        subscription.getDataValue('Podcast').getDataValue('Episodes').forEach((episode) => {
            if(episode.EpisodeProgresses[0] === undefined) {
                let insertPoint = episodes.findIndex(el => new Date(el.getDataValue('releaseDate')) < new Date(episode.getDataValue('releaseDate')));
                console.log(insertPoint);
                if(insertPoint === -1) insertPoint = episodes.length - 1;
                subscription.getDataValue('Podcast').setDataValue('Episodes', undefined);
                episode.setDataValue('Podcast', subscription.getDataValue('Podcast'));
                episodes.splice(insertPoint, 0, episode);
            } else if(!episode.EpisodeProgresses[0].played) {
                let insertPoint = episodes.findIndex(el => new Date(el.getDataValue('releaseDate')) < new Date(episode.getDataValue('releaseDate')));
                console.log(insertPoint);
                if(insertPoint === -1) insertPoint = episodes.length - 1;
                subscription.getDataValue('Podcast').setDataValue('Episodes', undefined);
                episode.setDataValue('Podcast', subscription.getDataValue('Podcast'));
                episodes.splice(insertPoint, 0, episode);
            }
        })
        console.log('Left episode loop.')
    })
    console.log('Left subscription loop.')
    console.log(episodes.length);
    return res.json(episodes);
}))

router.get('/:episodeId/comments', asyncHandler(async (req, res) => {
    const episodeId = req.params.episodeId;
    const comments = await Comment.findAll({where: {episodeId}, include: User, order: [['timestamp', 'ASC']]});
    return res.json(comments);
}))

router.post('/:episodeId/comments', requireAuth, asyncHandler(async (req, res) => {
    const episodeId = req.params.episodeId;
    const userId = req.user.id;
    const newComment = await Comment.create({
        userId,
        episodeId,
        timestamp: req.body.timestamp,
        text: req.body.text
    });
    newComment.dataValues.User = await User.findByPk(userId);

    return res.json(newComment);
}));

router.get('/:episodeId/progress', requireAuth, asyncHandler(async (req, res) => {
    const episodeId = req.params.episodeId;
    const userId = req.user.id;
    let episodeProgress = await EpisodeProgress.findOrCreate({where: {userId, episodeId}});
    if(!episodeProgress) {
        episodeProgress = await EpisodeProgress.create({
            userId,
            episodeId
        })
    }
    return res.json(episodeProgress);
}))

router.post('/:episodeId/progress', requireAuth, asyncHandler(async (req, res) => {
    const episodeId = req.params.episodeId;
    const userId = req.user.id;
    const { timestamp, played } = req.body;
    let episodeProgress = await EpisodeProgress.findOne({where: {userId, episodeId}});
    if(!episodeProgress) {
        episodeProgress = await EpisodeProgress.create({
            userId,
            episodeId,
            timestamp,
            played
        })
    } else {
        if(typeof played === 'boolean') episodeProgress.played = played;
        if(timestamp) episodeProgress.timestamp = timestamp;
        await episodeProgress.save();
    }
    return res.json(episodeProgress);

}))

module.exports = router;