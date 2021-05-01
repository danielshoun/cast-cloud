'use strict';
const faker = require('faker');
const { Podcast, User, Episode } = require('../models');

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

    const podcasts = await Podcast.findAll({
      include: {
        model: Episode
      }
    });
    const users = await User.findAll();

    const subscriptions = [];
    podcasts.forEach(podcast => {
      let numSubscribers = Math.floor(Math.random() * users.length);
      let used = new Set();
      for(let i = 0; i < numSubscribers; i++) {
        let randomUser = users[Math.floor(Math.random() * users.length)];
        while(used.has(randomUser.id) || randomUser.username === 'demo-user') {
          randomUser = users[Math.floor(Math.random() * users.length)];
        }
        const subscription = {
          userId: randomUser.id,
          podcastId: podcast.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        subscriptions.push(subscription);
        used.add(randomUser.id);
      }
    })

    return await queryInterface.bulkInsert('Subscriptions', subscriptions)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('EpisodeProgresses', null, {});
    return await queryInterface.bulkDelete('Subscriptions', null, {});
  }
};
