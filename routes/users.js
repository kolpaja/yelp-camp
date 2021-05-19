const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utilities/wrapAsync");
const passport = require("passport");
const users = require("../controllers/users");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", wrapAsync(users.registerUser));

router.get("/login", users.renderLoginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  users.loginUser
);

router.get("/logout", users.logoutUser);

module.exports = router;
