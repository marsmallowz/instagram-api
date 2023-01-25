const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const PORT = process.env.PORT;
const routes = require("./routes");
console.log(PORT);
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// const db = require("./models");
// db.sequelize.sync();

app.use("/users", routes.usersRoute);
app.use("/auth", routes.authRoute);
app.use("/posts", routes.postsRoute);
app.use("/comments", routes.commentsRoute);

app.get("/", (req, res) => {
  res.send("api is running");
});

app.listen(PORT, () => {
  console.log("server is running on Port " + PORT);
});
