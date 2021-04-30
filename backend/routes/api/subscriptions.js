const express = require('express');
const asyncHandler = require('express-async-handler');
const Parser = require("rss-parser");
const fetch = require('node-fetch');
const { requireAuth } = require('../../utils/auth');
const { Subscription, Podcast , Episode } = require('../../db/models');

const router = express.Router();

router.get('/', requireAuth, asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.findAll({where: {userId: req.user.id}, include: Podcast});
    // for (const subscription of subscriptions) {
    //     const podcast = subscription.Podcast;
    //     const headRes = await fetch(podcast.rssUrl, {
    //         method: 'HEAD',
    //         headers: {
    //             'If-Modified-Since': new Date(podcast.updatedAt).toUTCString()
    //         }
    //     });
    //     let feedData;
    //     if(new Date(headRes.headers.get('last-modified')) > new Date(podcast.updatedAt)) {
    //         const parser = new Parser();
    //         feedData = await parser.parseURL(podcast.rssUrl);
    //     } else {
    //         feedData = {items: []};
    //     }
    //
    //     const newEpisodes = [];
    //     for(let i = 0; i < feedData.items.length; i++) {
    //         let item = feedData.items[i];
    //         if(new Date(item.isoDate) < new Date(podcast.updatedAt)) break;
    //         const episode = {
    //             podcastId: podcast.id,
    //             title: item.title,
    //             description: item.itunes.summary || item.contentSnippet,
    //             url: item.enclosure.url,
    //             releaseDate: item.isoDate,
    //             guid: item.guid
    //         };
    //         newEpisodes.push(episode);
    //     }
    //     await Episode.bulkCreate(newEpisodes);
    //     podcast.updatedAt = new Date();
    //     await podcast.save();
    // }
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