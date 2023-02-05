const { parse } = require("mustache");
const { Op } = require("sequelize");
const db = require("../models");
const Post = db.post;
const User = db.user;
const { sequelize } = require("../models");
const moment = require("moment"); // require
// perbedaan import dengan kurung dan tidak adalah
// dengan menggunakan kurung tidak dapat sugestion

const postsController = {
  getPosts: async (req, res) => {
    console.log(" my rq query");
    console.log(req.query);
    const { offset, limit, date } = req.query;
    // console.log("my date");
    // const tanggal = Date.now();
    // console.log(moment().format());
    // console.log();
    // console.log(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
    // console.log(new Date(tanggal));
    // console.log(new Date(date));
    // cari semua post dengan created
    // kurang dari date sekarang. yang mana date disimpan didalam const.
    // atau dengan idpost kurang dari idpost paling atas ? tapi idpost dapat darimana?
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
        where: {
          createdAt: {
            [Op.lte]: new Date(date).toISOString(),
          },
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
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
    const { caption, userId } = req.body;
    // let listPhoto = [{ url: req.file.filename }];
    console.log("bawah ni list foto");
    console.log(req.files);
    let listPhoto = [];
    if (req.files?.length) {
      listPhoto = await req.files.map((photo) => {
        return {
          url:
            process.env.API_URL +
            process.env.EXPOSE_PORT +
            process.env.RENDER_POST_IMAGE +
            photo.filename,
        };
      });
    }
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
      res.send(result);
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
  postLiked: async (req, res) => {
    const { postId, userId, liked } = req.body;
    console.log(req.body);
    const t = await sequelize.transaction();
    try {
      if (liked) {
        await db.postslikes.create({
          postId: postId,
          userId: userId,
        });
      } else {
        await db.postslikes.destroy({
          where: [
            {
              postId: postId,
            },
            {
              userId: userId,
            },
          ],
        });
      }

      await t.commit();
      res.status(200).json({ message: "Succes" });
    } catch (err) {
      await t.rollback();
      console.log(err);
      return res.status(400).json({
        message: err,
      });
    }
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
