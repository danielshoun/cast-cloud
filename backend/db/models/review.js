'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.User, {foreignKey: 'userId'});
      Review.belongsTo(models.Podcast, {foreignKey: 'podcastId'});
    }
  };
  Review.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    podcastId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    rating: {
      allowNull: false,
      type:DataTypes.INTEGER
    },
    text: {
      allowNull: false,
      type: DataTypes.STRING(2000)
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};