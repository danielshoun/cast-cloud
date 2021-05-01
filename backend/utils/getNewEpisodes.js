const fetch = require('node-fetch');
const Parser = require("rss-parser");

async function getNewEpisodes(podcast, newPodcast) {
    const headRes = await fetch(podcast.rssUrl, {
        method: 'HEAD',
        headers: {
            'If-Modified-Since': new Date(podcast.updatedAt).toUTCString()
        }
    });
    let feedData;
    if(new Date(headRes.headers.get('last-modified')) > new Date(podcast.updatedAt) || newPodcast) {
        console.log('Is New Podcast');
        const parser = new Parser();
        feedData = await parser.parseURL(podcast.rssUrl);
    } else {
        console.log('Is Not New Podcast');
        feedData = {items: []};
    }

    const newEpisodes = [];
    for(let i = 0; i < feedData.items.length; i++) {
        let item = feedData.items[i];
        if(new Date(item.isoDate) < new Date(podcast.updatedAt) && !newPodcast) break;
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
    return newEpisodes;
}

module.exports = getNewEpisodes;