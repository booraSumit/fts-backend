const jwt = require("jsonwebtoken");
const config = require("config");

const authSocketMiddleware = (socket, next) => {
  // since you are sending the token with the query
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Token Not Found !"));
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    decoded;
    next();
  } catch (err) {
    console.log(err);
    return next(new Error("Invalid Authorization"));
  }
  // if (decoded) next();
  // else next(new Error("Invalid Authorization"));
};

module.exports = authSocketMiddleware;
