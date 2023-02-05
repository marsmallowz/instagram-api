const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const mailer = require("../lib/mailer");
const sharp = require("sharp");
const mustache = require("mustache");
const fs = require("fs");
const User = db.user;
const secret = process.env.SECRET_KEY;
const authController = {
  emailVerification: async (req, res) => {
    console.log(req.params.token);
    const token = req.params.token;
    try {
      const data = await jwt.verify(token, secret);
      console.log(data);
      await User.update(
        {
          verified: true,
        },
        {
          where: {
            id: data.id,
          },
        }
      );
      res.status(200).json({
        message: "Verified",
      });
    } catch (error) {
      res.status(400).json({
        message: error,
      });
    }
  },
  register: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        message: errors,
      });
    }
    console.log(req.body);
    const { phoneNumber, fullname, email, username, password, repassword } =
      req.body;
    if (password.length > 8 && password === repassword) {
      const hashPassword = bcrypt.hashSync(password, 10);
      try {
        const result = await User.create({
          email: email,
          phoneNumber: phoneNumber,
          username: username,
          password: hashPassword,
          fullname: fullname,
          avatarUrl:
            "https://icon-library.com/images/default-profile-icon/default-profile-icon-24.jpg",
        });
        const template = fs
          .readFileSync(__dirname + "/../templates/verify.html")
          .toString();

        const token = jwt.sign(
          { id: result.dataValues.id, username: result.dataValues.username },
          process.env.SECRET_KEY,
          {
            expiresIn: "10m",
          }
        );

        const renderedTemplate = mustache.render(template, {
          username,
          verify_url: `http://localhost:${process.env.EXPOSE_PORT}/auth/emailverify/${token}`,
          full_name: fullname,
        });

        await mailer({
          subject: "Verify your instagram account",
          html: renderedTemplate,
        });

        res.status(201).json(result);
      } catch (err) {
        if (err.parent.code === "ER_DUP_ENTRY") {
          res.status(409).json({
            message: "Email, Username atau Phone Number has been used",
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
  checkToken: async (req, res) => {
    console.log("ngecek");
    console.log(req.user);
    try {
      const newUser = await User.findByPk(req.user.id);
      console.log(newUser);
      res.status(200).json({
        id: newUser.dataValues.id,
        email: newUser.dataValues.email,
        username: newUser.dataValues.username,
        phoneNumber: newUser.dataValues.phoneNumber,
        fullname: newUser.dataValues.fullname,
        avatarUrl: newUser.dataValues.avatarUrl,
      });
    } catch (error) {
      res.status(400).json({
        message: "No User Found",
      });
    }
  },

  login: async (req, res) => {
    const t = await db.sequelize.transaction();
    const { username_email_phonenumber, password } = req.body;
    try {
      const result = await User.findOne({
        where: {
          [Op.or]: [
            { email: username_email_phonenumber },
            { username: username_email_phonenumber },
            { phoneNumber: username_email_phonenumber },
          ],
        },
      });

      const newDate = new Date();
      if (result.wrongPassword >= 3) {
        const suspendTime = new Date();
        suspendTime.setMinutes(suspendTime.getMinutes() + 1);
        await db.usersuspends.create({
          suspendUntil: suspendTime,
          userId: result.id,
        });
        await db.user.update(
          {
            wrongPassword: 0,
          },
          {
            where: {
              id: result.id,
            },
          }
        );
      }
      const checkSuspend = await db.usersuspends.findOne({
        where: {
          userId: result.id,
        },
        order: [["id", "DESC"]],
      });

      if (checkSuspend) {
        if (checkSuspend?.suspendUntil > newDate) {
          const sisa_menit =
            checkSuspend.suspendUntil.getMinutes() - newDate.getMinutes();
          return res.status(400).json({
            message: `anda terkena suspend tidak bisa login hingga ${sisa_menit} menit `,
          });
        }
      }
      const isValid = await bcrypt.compare(password, result.password);

      if (!isValid) {
        await db.user.update(
          {
            wrongPassword: result.wrongPassword + 1,
          },
          {
            where: {
              id: result.id,
            },
          }
        );

        return res.status(400).json({
          message:
            "gagal login password salah " +
            Number(result.wrongPassword + 1) +
            " kali",
          // message: "username and Password password does not match",
        });
      }
      const token = jwt.sign({ ...result.dataValues }, secret, {
        expiresIn: "1h",
      });
      await t.commit();
      console.log("result");
      console.log(result);
      res.status(200).json({
        token: token,
        user: {
          id: result.id,
          email: result.email,
          username: result.username,
          phoneNumber: result.phoneNumber,
          fullname: result.fullname,
          avatarUrl: result.avatarUrl,
        },
      });
    } catch (err) {
      await t.rollback();
      res.status(400).json({
        message: err,
      });
    }
  },
};

module.exports = authController;
