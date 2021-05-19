const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review");
const Campground = require("../models/campground");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const ExpressError = require("../utilities/ExpressError");
const wrapAsync = require("../utilities/wrapAsync");

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Your review was removed!");
    res.redirect(`/campgrounds/${id}`);
  })
);

router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    req.flash(
      "success",
      "Review just added. Thank you for your time! Your experience matters."
    );
    await review.save();
    campground.reviews.push(review);
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
