const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = db.user;
const secret = process.env.secret_key;
const authController = {
  register: async (req, res) => {
    console.log(req.body);
    const { fullname, email, username, password, repassword, avatarUrl } =
      req.body;
    if (password.length > 8 && password === repassword) {
      const hashPassword = bcrypt.hashSync(password, 10);
      try {
        const result = await User.create({
          email: email,
          avatarUrl:
            "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
          username: username,
          password: hashPassword,
          fullname: fullname,
        });
        res.status(201).json(result);
      } catch (err) {
        if (err.parent.code === "ER_DUP_ENTRY") {
          res.status(409).json({
            message: "Email atau Username telah digunakan",
          });
        } else {
          res.status(400).json({
            message: err.parent.code,
          });
        }
      }
    } else {
      res.status(400).json({
        message: "Password and confirm password does not match",
      });
    }
  },

  login: async (req, res) => {
    console.log(secret);
    console.log(req.body);
    const { username, password } = req.body;
    try {
      const result = await User.findOne({
        where: {
          username: username,
        },
      });
      if (!result) {
        return res.status(400).json({
          message: "username and Password password does not match",
        });
      }
      const isValid = await bcrypt.compare(password, result.password);
      console.log("isValid");
      console.log(isValid);
      if (!isValid) {
        return res.status(400).json({
          message: "username and Password password does not match",
        });
      }
      console.log("secret");
      const token = jwt.sign({ ...result.dataValues }, "qweqwe", {
        expiresIn: "1h",
      });
      res.send(token);
    } catch (err) {
      res.status(400).json({
        message: err,
      });
    }
  },
};

module.exports = authController;
