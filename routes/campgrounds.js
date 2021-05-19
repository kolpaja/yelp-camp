const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const Campground = require("../models/campground");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get("/", wrapAsync(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.newCampForm);

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  wrapAsync(campgrounds.makeCamp)
);

router.get("/:id", wrapAsync(campgrounds.showCamp));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.editCampForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  wrapAsync(campgrounds.editedCamp)
);

router.delete("/:id", isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamp));

module.exports = router;
