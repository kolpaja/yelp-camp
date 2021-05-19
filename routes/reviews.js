const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");
const ExpressError = require("../utilities/ExpressError");
const wrapAsync = require("../utilities/wrapAsync");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.makeReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
