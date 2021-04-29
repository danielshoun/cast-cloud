'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Comment.belongsTo(models.User, {foreignKey: 'userId'});
      Comment.belongsTo(models.Episode, {foreignKey: 'episodeId'});
    }
  };
  Comment.init({
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
  },
    episodeId: {
      allowNull: false,
      type:DataTypes.INTEGER
    },
    timestamp: {
      allowNull: false,
      type:DataTypes.NUMERIC
    },
    text: {
      allowNull: false,
      type:DataTypes.STRING(500)
    }
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};