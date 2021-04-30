'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EpisodeProgress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EpisodeProgress.belongsTo(models.User, {foreignKey: 'userId'});
      EpisodeProgress.belongsTo(models.Episode, {foreignKey: 'episodeId'});
    }
  };
  EpisodeProgress.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    episodeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamp: {
      type:DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    played: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'EpisodeProgress',
  });
  return EpisodeProgress;
};