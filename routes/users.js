const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const passport = require("passport");
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(wrapAsync(users.registerUser));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    users.loginUser
  );

router.get("/logout", users.logoutUser);

module.exports = router;
