'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Enemy extends Model {
    static associate(models) {
      // כאן ניתן לקשר בעתיד לשחקן או לקרבות
    }
  }
  Enemy.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stats: DataTypes.JSONB,
    items: DataTypes.JSONB,
    rewards: DataTypes.JSONB,
    abilities: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Enemy',
    tableName: 'enemies', // חשוב מאוד בגלל Postgres
  });
  return Enemy;
};