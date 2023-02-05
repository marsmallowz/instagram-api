"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "wrongPassword", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      after: "fullname",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "wrongPassword");
  },
};
