"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("UserSuspends", "userId", {
      type: Sequelize.INTEGER,
      after: "suspendUntil",
    });
    await queryInterface.addConstraint("UserSuspends", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_usersuspends_user",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      "UserSuspends",
      "fk_usersuspends_user"
    );
    await queryInterface.removeColumn("UserSuspends", "userId");
  },
};
