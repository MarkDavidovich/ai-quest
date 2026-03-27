'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('player_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // לכל משתמש פרופיל שחקן אחד
        references: {
          model: 'users', // מקשר לטבלת המשתמשים הקיימת
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      hp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      max_hp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 100
      },
      attack: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      defense: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10
      },
      position_x: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5 // קואורדינטת התחלה דיפולטיבית
      },
      position_y: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5 // קואורדינטת התחלה דיפולטיבית
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('player_profiles');
  }
};