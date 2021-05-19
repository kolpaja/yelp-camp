const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const Campground = require("../models/campground");

const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get(
  "/",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  isLoggedIn,
  validateCampground,
  wrapAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid campground data", 400)
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "You successfully made a new Campground");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    if (!campgrounds) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campgrounds });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    if (!campgrounds) {
      req.flash("error", "Campground not found");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campgrounds });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(
      id,
      req.body.campground,
      { runValidators: true, new: true }
    );
    req.flash("success", "Successfully updated your campground!");
    res.redirect(`/campgrounds/${campgrounds._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Your campground was successfully  deleted");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
