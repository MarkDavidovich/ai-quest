'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PlayerProfile extends Model {
    static associate(models) {
      // מגדיר את הקשר: פרופיל שחקן שייך למשתמש אחד
      PlayerProfile.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  PlayerProfile.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100 // חיים התחלתיים
    },
    max_hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100
    },
    attack: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10 // כוח התקפה בסיסי
    },
    defense: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10 // כוח הגנה בסיסי
    },
    position_x: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5 // מיקום התחלתי במפה (X)
    },
    position_y: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5 // מיקום התחלתי במפה (Y)
    }
  }, {
    sequelize,
    modelName: 'PlayerProfile',
    tableName: 'player_profiles' // חשוב כדי להתאים לשם הטבלה ב-Migration
  });

  return PlayerProfile;
};