const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utilities/wrapAsync");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  wrapAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome to yelpcamp");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", `${e.message} try another username`);
      res.redirect("/register");
    }
  })
);

module.exports = router;