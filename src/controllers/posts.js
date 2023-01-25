const db = require("../models");
const Post = db.post;
const User = db.user;

const postsController = {
  getPosts: async (_, res) => {
    try {
      const result = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ["username", "avatarUrl"],
          },
          {
            model: db.postphotos,
            as: "photos",
            attributes: ["id", "url"],
          },
          {
            model: User,
            as: "likes",
            attributes: ["id", "username"],
            through: { attributes: [] },
          },
          {
            model: db.comment,
            as: "comments",
            attributes: ["id", "comment", "updatedAt"],
            include: {
              model: User,
              attributes: ["username", "avatarUrl"],
            },
          },
        ],
      });
      console.log(result);
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  addPosts2: async (req, res) => {
    console.log(req.body);
    const { caption, userId, imageList } = req.body;
    let listPhoto = [];
    if (imageList?.length) {
      listPhoto = await imageList.map((photo) => {
        return {
          url: photo,
        };
      });
    }
    console.log(listPhoto);
    try {
      const result = await Post.create(
        {
          caption: caption,
          userId: userId,
          photos: listPhoto,
        },
        {
          include: "photos",
        }
      );
      // console.log("this is result");
      // console.log(result);
      res.send(result);
      // res.status(200).json({
      //   message: "sukses",
      // });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  },

  addPosts: async (req, res) => {
    console.log(req.body);
    const { caption, userId, imageList } = req.body;
    const listPhoto = imageList.map((photo) => {
      return {
        url: photo,
      };
    });
    console.log(listPhoto);
    try {
      const result = await Post.create(
        {
          caption: caption,
          userId: userId,
          photos: listPhoto,
        },
        {
          include: "photos",
        }
      );
      console.log(result);
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: error,
      });
    }
  },
  addLike: async (req, res) => {
    // console.log(req.body);
    // console.log(req.params.id);
    // const { userId } = req.body;
    // try {
    //   const result = db;
    // } catch (error) {}
  },

  // getPost: (req, res) => {
  //   const id = req.params.id;
  //   const filteredPosts = posts.filter((val) => {
  //     return val.id == id;
  //   });
  //   res.status(200).json(filteredPosts[0]);
  // },
};

module.exports = postsController;
