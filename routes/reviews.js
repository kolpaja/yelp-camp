const express = require("express")
const router = express.Router({ mergeParams: true });
const { reviewSchemaJoi } = require("../validateSchemas.js")

const Review = require("../models/review")
const Campground = require("../models/campground");

const ExpressError = require("../utilities/ExpressError")
const wrapAsync = require("../utilities/wrapAsync")

const validateReview = (req, res, next) => {
    const { error } = reviewSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else return next()
}

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router