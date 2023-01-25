const express = require("express");
const router = express.Router();

const { postsController } = require("../controllers");
const { verifyToken } = require("../middlewares/auth");

router.get("/", postsController.getPosts);
router.post("/", postsController.addPosts);
router.post("/2", verifyToken, postsController.addPosts2);

router.post("/:id/liked", postsController.addLike);

// router.put("/", postsController.updatePosts);
// router.get("/:id", postsController.getPost);

module.exports = router;
