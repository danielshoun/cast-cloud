const express = require('express');
const asyncHandler = require('express-async-handler');
const fetch = require("node-fetch");
const Parser = require('rss-parser');
const { Podcast } = require('../../db/models');

const parser = new Parser();

const router = express.Router();

router.get('/search', asyncHandler(async (req, res) => {
    const term = req.query.term;
    const itunesRes = await fetch(`https://itunes.apple.com/search?media=podcast&term=${term}`);
    const itunesData = await itunesRes.json();
    return res.json(itunesData.results);
}))

router.get('/', asyncHandler(async (req, res) => {
    const itunesId = req.query.itunesId;
    let podcast = await Podcast.findOne({where: {itunesId}});
    if(!podcast) {
        const itunesRes = await fetch(`https://itunes.apple.com/lookup?id=${itunesId}`);
        const itunesData = await itunesRes.json();
        const itunesPodcast = itunesData.results[0];
        const rssUrl = itunesPodcast.feedUrl;
        const feedData = await parser.parseURL(rssUrl);

        podcast = await Podcast.create({
            title: itunesPodcast.collectionName,
            artist: itunesPodcast.artistName,
            description: feedData.description,
            artworkUrl: itunesPodcast.artworkUrl600,
            itunesId: itunesPodcast.collectionId,
            rssUrl: itunesPodcast.feedUrl
        })
    }

    return res.json(podcast);
}))

module.exports = router;