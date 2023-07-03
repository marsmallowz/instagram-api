const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: "akses ditolak",
    });
  }
  try {
    token = token.split(" ")[1];

    if (token === null || !token) {
      return res.status(401).json({
        message: "akses ditolak",
      });
    }

    let verifiedUser = jwt.verify(token, secret);

    req.user = verifiedUser;
    // if (req.body.userId !== req.user.id) {
    //   return res.status(401).json({
    //     message: "akses ditolak",
    //   });
    // }
    next();
  } catch (error) {
    return res.status(401).json({
      message: error,
    });
  }
};

module.exports = { verifyToken };
