"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NPC extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // כאן ניתן להגדיר קשרים (associations) בעתיד, למשל עם טבלת קווסטים
    }
  }

  NPC.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false, // שם הוא שדה חובה
      },
      personality: {
        type: DataTypes.TEXT,
      },
      position_x: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // ערך ברירת מחדל כדי למנוע ערכי null במיקום
      },
      position_y: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      prompt_template: {
        type: DataTypes.TEXT,
      },
      memory: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "NPC",
      tableName: "NPCs", // חשוב מאוד: זה פותר את בעיית ה-Case Sensitivity מול Postgres
      underscored: false, // מבטיח שמות עמודות כמו createdAt (ולא created_at) כפי שמופיע במיגרציה
    },
  );

  return NPC;
};
