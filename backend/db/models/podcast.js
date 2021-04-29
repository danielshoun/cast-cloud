'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Podcast extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Podcast.hasMany(models.Episode, {foreignKey: 'podcastId'});
      Podcast.hasMany(models.Review, {foreignKey: 'podcastId'});
    }
  };
  Podcast.init({
    title: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    artist: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    artworkUrl: {
      type: DataTypes.STRING(500)
    },
    itunesId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    rssUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Podcast',
  });
  return Podcast;
};