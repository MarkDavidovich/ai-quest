'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.PlayerProfile, {
        foreignKey: 'user_id',
        as: 'profile'
      });

      User.hasMany(models.Inventory, {
        foreignKey: 'user_id',
        as: 'inventory'
      });

      User.hasOne(models.GameSession, {
        foreignKey: 'user_id',
        as: 'session'
      });
    }
  }


  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User', // שונה ל-U גדולה
    tableName: 'users' // מומלץ תמיד להוסיף כדי שה-ORM ידע בדיוק לאיזו טבלה לפנות
  });

  return User;
};