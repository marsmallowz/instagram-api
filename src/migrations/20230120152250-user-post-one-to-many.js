"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Posts", "userId", {
      type: Sequelize.INTEGER,
      after: "caption",
    });
    await queryInterface.addConstraint("Posts", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_posts_user",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Posts", "fk_posts_user");
    await queryInterface.removeColumn("Posts", "userId");
  },
};
