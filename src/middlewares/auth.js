const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;

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

    if (token === null || !token) {
      return res.status(401).json({
        message: "akses ditolak",
      });
    }
    console.log("mysceret");
    console.log(secret);

    let verifiedUser = jwt.verify(token, secret);
    console.log("verifiedUser");
    console.log(verifiedUser);

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
