"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("enemies", [
      {
        name: "Goblin",
        stats: JSON.stringify({ hp: 50, mp: 0, speed: 10 }),
        items: JSON.stringify([{ name: "potion", qty: 1 }]),
        rewards: JSON.stringify({ gold: 20, items: ["goblin ear"] }),
        abilities: JSON.stringify(["attack", "hide"]),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("enemies", null, {});
  },
};
