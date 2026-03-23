"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("enemies", {
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
      stats: {
        type: Sequelize.JSONB, // מאפשר לשמור { "hp": 100, "attack": 15 }
        defaultValue: {},
      },
      items: {
        type: Sequelize.JSONB, // מאפשר לשמור [ { "name": "potion", "qty": 1 } ]
        defaultValue: [],
      },
      rewards: {
        type: Sequelize.JSONB, // מאפשר לשמור { "gold": 50, "items": ["sword"] }
        defaultValue: {},
      },
      abilities: {
        type: Sequelize.JSONB, // מאפשר לשמור ["attack", "defend"]
        defaultValue: [],
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
    await queryInterface.dropTable("enemies");
  },
};
