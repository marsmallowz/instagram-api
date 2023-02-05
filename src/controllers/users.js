const db = require("../models");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const User = db.user;
const secret = process.env.secret_key;
const usersController = {
  editUser: (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const { fullname, username, phonenumber } = req.body;
    const data = { username, fullname, phoneNumber: phonenumber };
    try {
      if (req.file) {
        const image_url =
          process.env.API_URL +
          process.env.EXPOSE_PORT +
          process.env.RENDER_AVATAR_IMAGE +
          req.file.filename;
        data.avatarUrl = image_url;
      }
      const result = User.update(
        {
          ...data,
        },
        {
          where: {
            id: id,
          },
        }
      );
      return res.status(200).json({
        message: "user edited",
        result,
      });
    } catch (error) {
      return res.status(400).json({
        message: err.toString(),
      });
    }
  },

  getUsers: (req, res) => {
    const qString = "select * from users";
    db.query(qString, (err, result) => {
      if (err) {
        res.status(400).json({
          message: "query error",
        });
      }
      res.status(200).json(result);
    });
    // res.status(200).json(users);
  },

  login: async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;
    try {
      const result = await User.findOne({
        where: {
          username: username,
          password: password,
        },
      });
      res.send(result);
    } catch (err) {
      res.status(400).json({
        message: "username and Password password does not match",
      });
    }
  },

  login2: async (req, res) => {
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
      if (!isValid) {
        return res.status(400).json({
          message: "username and Password password does not match",
        });
      }
      console.log(secret);
      const token = jsonwebtoken.sign({ ...result }, "qweqwe", {
        expiresIn: "1h",
      });
      res.send(token);
    } catch (err) {
      res.status(400).json({
        message: "username and Password password does not match",
      });
    }
  },

  addUsers: async (req, res) => {
    console.log(req.body);
    const { fullname, email, username, password, repassword, avatarUrl } =
      req.body;
    if (password.length > 8 && password === repassword) {
      try {
        const result = await User.create({
          email: email,
          avatarUrl: avatarUrl,
          username: username,
          password: password,
          fullname: fullname,
        });
        res.status(201).json(result);
      } catch (err) {
        if (err.parent.code === "ER_DUP_ENTRY") {
          res.status(400).json({
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
};

module.exports = usersController;
