"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Comments", "postId", {
      type: Sequelize.INTEGER,
      after: "comment",
    });
    await queryInterface.addConstraint("Comments", {
      fields: ["postId"],
      type: "foreign key",
      name: "fk_comments_post",
      references: {
        table: "Posts",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Comments", "fk_comments_post");
    await queryInterface.removeColumn("Comments", "postId");
  },
};
