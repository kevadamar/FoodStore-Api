const jwt = require("jsonwebtoken")
const { secretKey } = require("../config");
const User = require("../models/User");
const { getToken } = require("../utils/getToken");

function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);

      if (!token) return next();

      req.user = jwt.verify(token, secretKey);

      let user = await User.findOne({ token: { $in: [token] } });

      if (!user) {
        return res.status(400).json({
          error: 1,
          message: "Token expired",
        });
      }
    } catch (err) {
      // (1) tangani error yang terkait JsonWebTokenError
      if (err && err.name === "JsonWebTokenError") {
        return res.json({
          error: 1,
          message: err.message,
        });
      }
      // (2) tangani error lainnya
      next(err);
    }
    return next()
  };
}

module.exports = {
    decodeToken
}
