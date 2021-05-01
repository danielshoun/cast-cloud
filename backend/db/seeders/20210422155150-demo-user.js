'use strict';
const faker = require('faker');
const bcrypt = require('bcryptjs');

const users = [{
	email: 'demo@user.io',
	username: 'demo-user',
	hashedPassword: bcrypt.hashSync('password')
}];

let usedEmails = new Set();
let usedUsernames = new Set();

for(let i = 0; i < 1000; i++) {
	let email = faker.internet.email();
	while(usedEmails.has(email) || email.length > 256) {
		email = faker.internet.email();
	}
	let username = faker.internet.userName();
	while(usedUsernames.has(username) || username.length > 30 || username.length < 4) {
		username = faker.internet.username();
	}
	users.push({
		email,
		username,
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
