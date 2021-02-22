const User = require("../models/User");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { secretKey } = require("../config");
const { getToken } = require("../utils/getToken");

async function me(req, res, next) {
  if (!req.user) {
    return res.status(400).json({
      error: 1,
      message: "Your're not login or token expired",
    });
  }
  return res.status(200).json({
    status: 200,
    message: "Success",
    data: req.user,
  });
}

async function register(req, res, next) {
  try {
    const payload = req.body;
    let user = new User(payload);
    await user.save();

    return res.status(200).json({
      status: 200,
      messages: "User registered",
      data: user,
    });
  } catch (error) {
    // (1) cek kemungkinan kesalahan terkait validasi
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    // (2) error lainnya
    next(err);
  }
}

async function localStrategy(email, password, done) {
  try {
    let user = await User.findOne({ email },"-__v -createdAt -updatedAt -cart_items -token");
        
    if (!user) done();

    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());

      return done(null, userWithoutPassword);
    }
  } catch (error) {
    done(null, error);
  }
  done();
}

async function login(req, res, next) {
  passport.authenticate("local", async function (err, user) {
    if (err) return next(err);
    
    if (!user)
      return res.json({ error: 1, message: "email or password incorrect" });

    // (1) buat JSON Web Token
    let signed = jwt.sign(user, secretKey); // <--- ganti secret key dengan keymu sendiri, bebas yang sulit ditebak

    // (2) simpan token tersebut ke user terkait
    await User.findOneAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    );
    
    // (3) response ke _client_
    return res.json({
      message: "logged in successfully",
      user: user,
      token: signed,
    });
  })(req, res, next);
}

async function logout(req, res, next) {
  let token = getToken(req);

  let user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false }
  );

  if (!user || !token) {
    return res.status(400).json({
      error: 1,
      message: "User not found",
    });
  }

  return res.status(200).json({
    status: 200,
    message: "Berhasil logout",
  });
}

module.exports = {
  register,
  localStrategy,
  login,
  me,
  logout,
};
