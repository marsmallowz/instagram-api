const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;
  console.log("myToken");
  console.log(token);
  if (!token) {
    return res.status(401).json({
      message: "akses ditolak",
    });
  }
  try {
    token = token.split(" ")[1];
    console.log("myToken2");
    console.log(token);
    if (token === null || !token) {
      return res.status(401).json({
        message: "akses ditolak",
      });
    }
    let verifiedUser = jwt.verify(token, "qweqwe");

    req.user = verifiedUser;
    console.log("batas");
    console.log(verifiedUser);
    console.log(req.user);
    console.log(req.body.userId);
    if (req.body.userId !== req.user.id) {
      return res.status(401).json({
        message: "akses ditolak",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: error,
    });
  }
};

module.exports = { verifyToken };
