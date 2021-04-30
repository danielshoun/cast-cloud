const express = require('express');
const asyncHandler = require('express-async-handler');
const fetch = require("node-fetch");
const Parser = require('rss-parser');
const { Podcast, Episode, Review, User, Subscription } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

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
    } else {
        rssUrl = podcast.rssUrl;
        const headRes = await fetch(podcast.rssUrl, {
            method: 'HEAD',
            headers: {
                'If-Modified-Since': new Date(podcast.updatedAt).toUTCString()
            }
        })
        console.log('HEAD RES BELOW')
        console.log(headRes.headers.get('last-modified'));
        console.log('HERES THE MOST RECENT DATE');
        console.log(new Date(podcast.updatedAt).toUTCString());
        if(new Date(headRes.headers.get('last-modified')) > new Date(podcast.updatedAt)) {
            feedData = await parser.parseURL(rssUrl);
        } else {
            feedData = {items: []};
            console.log('NO NEED TO UPDATE');
        }
    }



    const newEpisodes = [];
    for(let i = 0; i < feedData.items.length; i++) {
        let item = feedData.items[i];
        if(!newPodcast && new Date(item.isoDate) < new Date(podcast.updatedAt)) break;
        const episode = {
            podcastId: podcast.id,
            title: item.title,
            description: item.itunes.summary || item.contentSnippet,
            url: item.enclosure.url,
            releaseDate: item.isoDate,
            guid: item.guid
        };
        newEpisodes.push(episode);
    }
    await Episode.bulkCreate(newEpisodes);
    if(!newPodcast) {
        podcast.updatedAt = new Date();
        await podcast.save();
    }

    return res.json(podcast);
}))

router.get('/:id/episodes', asyncHandler(async (req, res) => {
    const podcastId = req.params.id;
    const episodes = await Episode.findAll({
        where: {podcastId},
        order: [['releaseDate', 'DESC']]
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