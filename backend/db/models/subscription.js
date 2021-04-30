'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subscription.belongsTo(models.User, {foreignKey: 'userId'});
      Subscription.belongsTo(models.Podcast, {foreignKey: 'podcastId'});
    }
  };
  Subscription.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    podcastId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Subscription',
  });
  return Subscription;
};