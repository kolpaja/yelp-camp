const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCamp } = require("../middleware");

router
  .route("/")
  .get(wrapAsync(campgrounds.index))
  .post(isLoggedIn, validateCamp, wrapAsync(campgrounds.makeCamp));

router.get("/new", isLoggedIn, campgrounds.newCampForm);

router
  .route("/:id")
  .get(wrapAsync(campgrounds.showCamp))
  .put(isLoggedIn, isAuthor, validateCamp, wrapAsync(campgrounds.editedCamp))
  .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamp));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.editCampForm)
);

module.exports = router;
