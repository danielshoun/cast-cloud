'use strict';
const faker = require('faker');
const bcrypt = require('bcryptjs');

const users = [{
	email: 'demo@user.io',
	username: 'demo-user',
	hashedPassword: bcrypt.hashSync('password')
}];

for(let i = 0; i < 999; i++) {
	users.push({
		email: faker.internet.email(),
		username: faker.internet.userName(),
		hashedPassword: bcrypt.hashSync(faker.internet.password())
	});
}

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

		return await queryInterface.bulkInsert('Users', users);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */

		 const Op = Sequelize.Op;
		 return queryInterface.bulkDelete('Users', {});
	}
};
