'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GameSession extends Model {
    static associate(models) {
      GameSession.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  GameSession.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    current_map: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'house'
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'playing'
    },
    last_saved: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    quest_progress: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    }
  },
    {
      sequelize,
      modelName: 'GameSession',
      tableName: 'game_sessions'
    });

  return GameSession;
};