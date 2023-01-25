const db = require("../models");
const Comment = db.comment;

const commentsController = {
  createComments: async (req, res) => {
    console.log(req.body);
    const { comment, userId, postId } = req.body;
    try {
      const result = await Comment.create({
        comment: comment,
        userId: userId,
        postId: postId,
      });
      console.log("result hasi");

      console.log(result.dataValues.updateAt);
      const result2 = await db.user.findOne({
        attributes: ["username", "avatarUrl"],
        where: {
          id: result.userId,
        },
      });
      res.status(201).json({
        id: result.id,
        comment: result.comment,
        username: result2.username,
        avatarUrl: result2.avatarUrl,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  },
};
module.exports = commentsController;
