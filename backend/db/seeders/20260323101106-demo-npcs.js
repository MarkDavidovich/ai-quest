"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "NPCs",
      [
        {
          name: "Galdor the Wizard",
          personality: "angry",
          position_x: 10,
          position_y: 20,
          prompt_template: "you are a ${personality} wizard",
          memory: "Met the player once; suspicious of magic users.",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("NPCs", null, {});
  },
};
