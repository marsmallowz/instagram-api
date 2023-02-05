"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PostsLikes", {
      postId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("PostsLikes", {
      fields: ["postId"],
      type: "foreign key",
      name: "fk_postslikes_posts",
      references: {
        table: "Posts",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("PostsLikes", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_postslikes_users",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("PostsLikes", "fk_postslikes_users");
    await queryInterface.removeConstraint("PostsLikes", "fk_postslikes_posts");
    await queryInterface.dropTable("PostsLikes");
  },
};
