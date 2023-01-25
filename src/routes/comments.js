const express = require("express");
const router = express.Router();
const { commentsController } = require("../controllers");

router.post("/", commentsController.createComments);

module.exports = router;
