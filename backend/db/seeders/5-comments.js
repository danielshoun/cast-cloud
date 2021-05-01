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
        model: Episode,
        limit: 5,
        order: [['releaseDate', 'DESC']]
      }
    });
    const users = await User.findAll();

    let comments = [];
    podcasts.forEach(podcast => {
      podcast.Episodes.forEach(episode => {
        let numComments = Math.floor(Math.random() * 10) + 5;
        let used = new Set();
        for(let i = 0; i < numComments; i++) {
          let randomUser = users[Math.floor(Math.random() * users.length)];
          while(used.has(randomUser.id)) {
            randomUser = users[Math.floor(Math.random() * users.length)];
          }
          const comment = {
            userId: randomUser.id,
            episodeId: episode.id,
            timestamp: Math.floor(Math.random() * 900),
            text: faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date()
          }
          console.log(comment);
          comments.push(comment);
          used.add(randomUser.id);
        }
      })
    })

    return await queryInterface.bulkInsert('Comments', comments);
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
