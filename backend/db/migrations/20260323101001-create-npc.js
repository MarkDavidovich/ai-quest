"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("NPCs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      personality: {
        type: Sequelize.TEXT,
      },
      position_x: {
        type: Sequelize.INTEGER,
        defaultValue: 0, // מתחיל ב-0 אם לא צוין אחרת
      },
      position_y: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      prompt_template: {
        type: Sequelize.TEXT,
      },
      memory: {
        type: Sequelize.TEXT, // כאן נשמור את היסטוריית השיחות או עובדות חשובות
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("NPCs");
  },
};
