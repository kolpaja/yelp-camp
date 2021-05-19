const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const ExpressError = require("../utilities/ExpressError");
const Campground = require("../models/campground");
const { campgroundSchemaJoi } = require("../validateSchemas.js");
const { isLoggedIn } = require("../middleware");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchemaJoi.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else return next();
};

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
    req.flash("success", "You successfully made a new Campground");
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate(
      "reviews"
    );
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
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id);
    req.flash("success", "Your campground was successfully  deleted");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
