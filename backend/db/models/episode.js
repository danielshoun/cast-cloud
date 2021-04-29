'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Episode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Episode.belongsTo(models.Podcast, {foreignKey: 'podcastId'});
    }
  };
  Episode.init({
    podcastId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING(500)
    },
    description: {
      type: DataTypes.TEXT
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING(500)
    },
    releaseDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    guid: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Episode',
  });
  return Episode;
};