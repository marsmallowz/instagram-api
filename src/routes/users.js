const express = require("express");
const router = express.Router();

const { usersController } = require("../controllers");

router.get("/", usersController.getUsers);
router.post("/", usersController.addUsers);
router.post("/login", usersController.login);

// router.put("/", usersController.updateUsers);
// router.get("/:username", usersController.getUser);

module.exports = router;
