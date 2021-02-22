const routes = require("express").Router();
const multer = require("multer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const authController = require("../../controllers/authController");

passport.use(
  new LocalStrategy({ usernameField: "email" }, authController.localStrategy)
);

// Routes CRUD categories
routes.post("/register", multer().none(), authController.register);
routes.post("/login", multer().none(), authController.login);
routes.get("/me", authController.me);
routes.post("/logout", authController.logout);

// export routing lainnya
module.exports = routes;
