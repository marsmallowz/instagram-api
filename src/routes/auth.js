const express = require("express");
const router = express.Router();

const { authController } = require("../controllers");
const { body, validationResult } = require("express-validator");
const { verifyToken } = require("../middlewares/auth");

router.post("/register", body("email").isEmail(), authController.register);
router.post("/login", authController.login);
router.get("/checktoken", verifyToken, authController.checkToken);
router.get("/emailverify/:token", authController.emailVerification);

module.exports = router;
