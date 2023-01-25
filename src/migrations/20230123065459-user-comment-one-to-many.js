"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Comments", "userId", Sequelize.INTEGER, {
      after: "caption",
    });
    await queryInterface.addConstraint("Comments", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_comments_user",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Comments", "fk_comments_user");
    await queryInterface.removeColumn("Comments", "userId");
  },
};
