"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("UserSuspends", "suspendUntil", {
      type: Sequelize.DataTypes.DATE,
      defaultValue: Date.now,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("UserSuspends", "suspendUntil", {
      type: Sequelize.DataTypes.DATE,
    });
  },
};
