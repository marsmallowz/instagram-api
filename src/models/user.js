"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.hasMany(models.Post, { foreignKey: "userId" });
      // this.belongsToMany(models.Post, { through: "posts_likes" });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      fullname: DataTypes.STRING,
      avatarUrl: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      wrongPassword: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
