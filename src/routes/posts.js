const express = require("express");
const router = express.Router();

const { postsController } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");
const { fileUpload, upload } = require("../middlewares/multer");
router.post(
  "/",
  fileUpload({
    destinationFolder: "postImages",
    fileType: "image",
    prefix: "POST",
  }).array("image", 10),
  postsController.addPosts2
);
router.patch("/liked", postsController.postLiked);
router.get("/", postsController.getPosts);

// router.post("/", verifyToken, postsController.addPosts2);
// router.post("/", postsController.addPosts);
// router.put("/", postsController.updatePosts);
// router.get("/:id", postsController.getPost);

module.exports = router;
