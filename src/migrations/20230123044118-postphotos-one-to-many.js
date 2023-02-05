"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("PostPhotos", "postId", {
      type: Sequelize.INTEGER,
      after: "url",
    });
    await queryInterface.addConstraint("PostPhotos", {
      fields: ["postId"],
      type: "foreign key",
      name: "fk_postphotos_post",
      references: {
        table: "Posts",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("PostPhotos", "fk_postphotos_post");
    await queryInterface.removeColumn("PostPhotos", "postId");
  },
};
