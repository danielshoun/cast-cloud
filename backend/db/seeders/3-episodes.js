'use strict';
const { Podcast } = require('../models');
const Parser = require('rss-parser');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const parser = new Parser();
    const podcasts = await Podcast.findAll();
    const episodes = []
    for (const podcast of podcasts) {
        let feedData = await parser.parseURL(podcast.rssUrl);
      podcast.description = feedData.description || feedData.itunes.summary;
      await podcast.save();
        for(let i = 0; i < feedData.items.length; i++) {
          let item = feedData.items[i];
          const episode = {
            podcastId: podcast.id,
            title: item.title,
            description: item.itunes.summary || item.contentSnippet,
            url: item.enclosure.url,
            releaseDate: item.isoDate,
            guid: item.guid,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          episodes.push(episode);
        }
    }

    return await queryInterface.bulkInsert('Episodes', episodes);

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
