'use strict';
const { Validator } = require('sequelize');
const bcrypt = require('bcryptjs');

const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.Comment, {foreignKey: 'userId'});
			User.hasMany(models.Review, {foreignKey: 'userId'});
			User.hasMany(models.EpisodeProgress, {foreignKey: 'userId'});
		}
	}
	User.init({
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [4, 30],
				isNotEmail(value) {
					if(Validator.isEmail(value)) {
						throw new Error('Cannot be an email.');
					}
				}
			}
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [3, 256]
			}
		},
		hashedPassword: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [60, 60]
			}
		}
	}, {
		defaultScope: {
			attributes: {
				exclude: ['hashedPassword', 'email', 'createdAt', 'updatedAt']
			}
		},
		scopes: {
			currentUser: {
				attributes: { exclude: ['hashedPassword'] }
			},
			loginUser: {
				attributes: {}
			}
		},
		sequelize,
		modelName: 'User',
	});

	User.prototype.toSafeObject = function() {
		const { id, username, email } = this;
		return { id, username, email };
	}

	User.prototype.validatePassword = function(password) {
		return bcrypt.compareSync(password, this.hashedPassword.toString());
	}

	User.getCurrentUserById = async function(id) {
		return await User.scope('currentUser').findByPk(id);
	}

	User.login = async function({ credential, password}) {
		const { Op } = require('sequelize');
		const user = await User.scope('loginUser').findOne({
			where: {
				[Op.or]: {
					username: credential,
					email: credential
				}
			}
		});
		if(user && user.validatePassword(password)) {
			return await User.scope('currentUser').findByPk(user.id);
		}
	}

	User.signup = async function ({ username, email, password }) {
		const hashedPassword = bcrypt.hashSync(password);
		const user = await User.create({
			username,
			email,
			hashedPassword
		});
		return await User.scope('currentUser').findByPk(user.id);
	}

	return User;
};
