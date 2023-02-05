const express = require("express");
const router = express.Router();

const { usersController } = require("../controllers");
const { fileUpload } = require("../middlewares/multer");

router.get("/", usersController.getUsers);
router.post("/", usersController.addUsers);
router.post("/login", usersController.login);

// router.put("/", usersController.updateUsers);
// router.get("/:username", usersController.getUser);
router.patch(
  "/:id",
  fileUpload({
    destinationFolder: "avatarImages",
    fileType: "image",
    prefix: "AVATAR",
  }).single("image"),
  usersController.editUser
);

module.exports = router;
