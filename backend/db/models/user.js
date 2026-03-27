'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // static associate(models) {
    //   User.hasOne(models.PlayerProfile, {
    //     foreignKey: 'user_id',
    //     as: 'profile'
    //   });

    //   User.hasMany(models.Inventory, {
    //     foreignKey: 'user_id',
    //     as: 'inventory' // השם שישמש אותנו כשנשלוף את התיק של השחקן
    //   });

    //   User.hasOne(models.GameSassion, {
    //     foreignKey: 'user_id',
    //     as: 'session'
    //   });
    // }
    static associate(models) {
      // 1. נדפיס למסך אילו מודלים Sequelize באמת טען
      console.log("🔍 Available models in Sequelize:", Object.keys(models));

      // 2. נעטוף ב-If כדי למנוע קריסה בזמן הדיבוג
      if (models.PlayerProfile) {
        User.hasOne(models.PlayerProfile, { foreignKey: 'user_id', as: 'profile' });
      } else {
        console.log("❌ models.PlayerProfile is undefined!");
      }

      if (models.Inventory) {
        User.hasMany(models.Inventory, { foreignKey: 'user_id', as: 'inventory' });
      } else {
        console.log("❌ models.Inventory is undefined!");
      }

      if (models.GameSession) {
        User.hasOne(models.GameSession, { foreignKey: 'user_id', as: 'session' });
      } else {
        console.log("❌ models.GameSession is undefined!");
      }
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