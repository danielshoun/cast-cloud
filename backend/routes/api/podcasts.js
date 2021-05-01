const express = require('express');
const asyncHandler = require('express-async-handler');
const fetch = require("node-fetch");
const Parser = require('rss-parser');
const { Podcast, Episode, Review, User, Subscription, EpisodeProgress } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth');
const getNewEpisodes = require('../../utils/getNewEpisodes');

const router = express.Router();
const parser = new Parser();

router.get('/search', asyncHandler(async (req, res) => {
    const term = req.query.term;
    const itunesRes = await fetch(`https://itunes.apple.com/search?media=podcast&term=${term}`);
    const itunesData = await itunesRes.json();
    return res.json(itunesData.results);
}))

router.get('/:itunesId', asyncHandler(async (req, res) => {
    const itunesId = req.params.itunesId;
    let podcast = await Podcast.findOne({where: {itunesId}});
    let rssUrl;
    let feedData;
    let newPodcast = false;
    if(!podcast) {
        const itunesRes = await fetch(`https://itunes.apple.com/lookup?id=${itunesId}`);
        const itunesData = await itunesRes.json();
        const itunesPodcast = itunesData.results[0];
        rssUrl = itunesPodcast.feedUrl;
        feedData = await parser.parseURL(rssUrl);

        podcast = await Podcast.create({
            title: itunesPodcast.collectionName,
            artist: itunesPodcast.artistName,
            description: feedData.description || feedData.itunes.summary,
            artworkUrl: itunesPodcast.artworkUrl600,
            itunesId: itunesPodcast.collectionId,
            rssUrl: itunesPodcast.feedUrl
        })
        newPodcast = true;
    }
    const newEpisodes = await getNewEpisodes(podcast, newPodcast);
    await Episode.bulkCreate(newEpisodes);
    podcast.updatedAt = new Date();
    await podcast.save();

    return res.json(podcast);
}))

router.get('/:id/episodes', restoreUser, asyncHandler(async (req, res) => {
    const podcastId = req.params.id;
    if(req.query.subscription === '1') {
        const podcast = await Podcast.findByPk(podcastId);
        const newEpisodes = await getNewEpisodes(podcast);
        await Episode.bulkCreate(newEpisodes);
        podcast.updatedAt = new Date();
        await podcast.save();
    }
    let include = {};
    if(req.user) {
        include = {
            model: EpisodeProgress,
            required: false,
            where: {userId: req.user.id}
        }
    }
    const episodes = await Episode.findAll({
        where: {podcastId},
        order: [['releaseDate', 'DESC']],
        include
    })

    return res.json(episodes);
}))

router.get('/:podcastId/reviews', asyncHandler(async (req, res) => {
    const podcastId = req.params.podcastId;
    const reviews = await Review.findAll({where: {podcastId}, include: User, order: [['createdAt', 'DESC']]});
    return res.json(reviews);
}))

router.post('/:podcastId/reviews', requireAuth, asyncHandler(async (req, res) => {
    let newReview = {
        userId: req.user.id,
        podcastId: req.params.podcastId,
        rating: req.body.rating,
        text: req.body.text
    }
    newReview = await Review.create(newReview);
    newReview.dataValues.User = await User.findByPk(req.user.id);

    return res.json(newReview);
}))

router.post('/:podcastId/subscribe', requireAuth, asyncHandler(async (req, res) => {
    const subscription = await Subscription.create({
        userId: req.user.id,
        podcastId: req.params.podcastId
    })
    return res.json(subscription);
}))


module.exports = router;