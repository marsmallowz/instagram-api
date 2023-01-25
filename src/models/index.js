"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = require("./user")(sequelize, Sequelize);
db.post = require("./post")(sequelize, Sequelize);
db.comment = require("./comment")(sequelize, Sequelize);
db.postphotos = require("./postphotos")(sequelize, Sequelize);

//kalau tanpa { foreignKey: "userId" } maka defaultnya UserId.
db.user.hasMany(db.post, { foreignKey: "userId" });
db.post.belongsTo(db.user, { foreignKey: "userId" });

db.user.hasMany(db.comment, { foreignKey: "userId" });
db.comment.belongsTo(db.user, { foreignKey: "userId" });

db.post.hasMany(db.postphotos, { foreignKey: "postId", as: "photos" });
db.postphotos.belongsTo(db.post, { foreignKey: "postId" });

db.post.hasMany(db.comment, { foreignKey: "postId", as: "comments" });
db.comment.belongsTo(db.post, { foreignKey: "postId" });

db.post.belongsToMany(db.user, { through: "PostsLikes", as: "likes" });
db.user.belongsToMany(db.post, { through: "PostsLikes" });

module.exports = db;
