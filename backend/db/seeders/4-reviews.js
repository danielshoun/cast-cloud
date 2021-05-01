'use strict';
const faker = require('faker');
const { Podcast, User } = require('../models');



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

    const podcasts = await Podcast.findAll();
    const users = await User.findAll();

    const reviews = []

    podcasts.forEach(podcast => {
      let numReviews = Math.floor(Math.random() * 10) + 5;
      let used = new Set();
      for(let i = 0; i < numReviews; i++) {
        let randomUser = users[Math.floor(Math.random() * users.length)];
        while(used.has(randomUser.id)) {
          randomUser = users[Math.floor(Math.random() * users.length)];
        }
        const review = {
          userId: randomUser.id,
          podcastId: podcast.id,
          rating: Math.floor(Math.random() * 5) + 1,
          text: faker.lorem.paragraph(),
          createdAt: new Date(),
          updatedAt: new Date()
        }

        console.log(review);

        reviews.push(review)
        used.add(randomUser.id);
      }
    })

    return await queryInterface.bulkInsert('Reviews', reviews);
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
