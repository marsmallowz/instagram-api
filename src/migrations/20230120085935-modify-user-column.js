"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addIndex("Users", ["username"], {
      unique: true,
    });
    queryInterface.addIndex("Users", ["email"], {
      unique: true,
    });
    // queryInterface.addConstraint("Users", {
    //   fields: ["email"],
    //   type: "unique",
    //   name: "custom_unique_constraint_name",
    // });
    queryInterface.changeColumn("Users", "avatarUrl", {
      type: Sequelize.DataTypes.STRING,
      defaultValue: "",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeIndex("Users", ["username"], {
      unique: true,
    });
    queryInterface.removeIndex("Users", ["email"], {
      unique: true,
    });
    // queryInterface.removeConstraint("Users", "custom_unique_constraint_name");
    queryInterface.changeColumn("Users", "avatarUrl", {
      type: Sequelize.DataTypes.STRING,
    });
  },
};
