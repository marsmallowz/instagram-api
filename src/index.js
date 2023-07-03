const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;
const routes = require("./routes");
const { urlencoded } = require("body-parser");
console.log(PORT);

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(cors());

const db = require("./models");
db.sequelize.sync();

// try {
//   db.sequelize.authenticate();
//   console.log("Connection has been established successfully.");
// } catch (error) {
//   console.error("Unable to connect to the database:", error);
// }

app.use("/users", routes.usersRoute);
app.use("/auth", routes.authRoute);
app.use("/posts", routes.postsRoute);
app.use("/comments", routes.commentsRoute);

app.get("/", (_, res) => {
  res.send("api is running");
});
app.use(
  "/post-image",
  express.static(`${__dirname}/middlewares/public/postImages`)
);

app.use(
  "/avatar-image",
  express.static(`${__dirname}/middlewares/public/avatarImages`)
);

app.listen(PORT, () => {
  console.log("server is running on Port " + PORT);
});
