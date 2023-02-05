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
    await queryInterface.addIndex("Users", ["username"], {
      unique: true,
    });
    await queryInterface.addIndex("Users", ["email"], {
      unique: true,
    });
    await queryInterface.addIndex("Users", ["phoneNumber"], {
      unique: true,
    });
    // queryInterface.addConstraint("Users", {
    //   fields: ["email"],
    //   type: "unique",
    //   name: "custom_unique_constraint_name",
    // });
    await queryInterface.changeColumn("Users", "avatarUrl", {
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
    await queryInterface.removeIndex("Users", ["username"], {
      unique: true,
    });
    await queryInterface.removeIndex("Users", ["email"], {
      unique: true,
    });
    await queryInterface.removeIndex("Users", ["phoneNumber"], {
      unique: true,
    });
    // queryInterface.removeConstraint("Users", "custom_unique_constraint_name");
    await queryInterface.changeColumn("Users", "avatarUrl", {
      type: Sequelize.DataTypes.STRING,
    });
  },
};
