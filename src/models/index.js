"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const db = {};
const config = require(__dirname + "/../config/config.js")[env];
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
// const config = require("../config/config");
// console.log(config.development.database);
// const sequelize = new Sequelize({
//   username: config.development.username,
//   password: config.development.password,
//   database: "instagram2",
//   port: config.development.port,
//   dialect: config.development.dialect,
// });

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
db.usersuspends = require("./usersuspends")(sequelize, Sequelize);
db.postslikes = require("./postslikes")(sequelize, Sequelize);

//kalau tanpa { foreignKey: "userId" } maka defaultnya UserId.
db.user.hasMany(db.post, { foreignKey: "userId" });
db.post.belongsTo(db.user, { foreignKey: "userId" });

db.user.hasMany(db.usersuspends, { foreignKey: "userId", as: "suspends" });
db.usersuspends.belongsTo(db.user, { foreignKey: "userId" });

db.user.hasMany(db.comment, { foreignKey: "userId" });
db.comment.belongsTo(db.user, { foreignKey: "userId" });

db.post.hasMany(db.postphotos, { foreignKey: "postId", as: "photos" });
db.postphotos.belongsTo(db.post, { foreignKey: "postId" });
db.post.hasMany(db.comment, { foreignKey: "postId", as: "comments" });
db.comment.belongsTo(db.post, { foreignKey: "postId" });

// kalau tidak didefinisikan foreign key maka saat insert data maka
// foreign key yang dipakai adalah UserId.
db.post.belongsToMany(db.user, {
  through: db.postslikes,
  as: "likes",
  foreignKey: "postId",
});
db.user.belongsToMany(db.post, {
  through: db.postslikes,
  foreignKey: "userId",
});

module.exports = db;
