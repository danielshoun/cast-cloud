const express = require('express');
const asyncHandler = require('express-async-handler');
const fetch = require("node-fetch");
const Parser = require('rss-parser');
const { Podcast, Episode, Review } = require('../../db/models');

const parser = new Parser();

const router = express.Router();

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
    } else {
        rssUrl = podcast.rssUrl;
        feedData = await parser.parseURL(rssUrl);
    }

    const mostRecentEpisode = await Episode.findOne({
        where: {podcastId: podcast.id},
        order: [['releaseDate', 'DESC']]
    });

    const newEpisodes = [];
    for(let i = 0; i < feedData.items.length; i++) {
        let item = feedData.items[i];
        if (mostRecentEpisode) {
            if(new Date(mostRecentEpisode.releaseDate) >= new Date(item.isoDate)) break;
        }

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
    const reviews = await Review.findAll({where: {podcastId}, order: [['createdAt', 'DESC']]});
    return res.json(reviews);
}))


module.exports = router;