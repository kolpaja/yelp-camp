const express = require("express")
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync")
const ExpressError = require("../utilities/ExpressError")
const Campground = require("../models/campground");
const { campgroundSchemaJoi } = require("../validateSchemas.js")

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    } else return next()
}

router.get("/", wrapAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", (req, res) => {
    res.render("campgrounds/new");
});

router.post("/", validateCampground, wrapAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid campground data", 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get("/:id", wrapAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id).populate("reviews")
    res.render("campgrounds/show", { campgrounds });
}));

router.get("/:id/edit", wrapAsync(async (req, res) => {
    const campgrounds = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campgrounds });
}));

router.put("/:id", validateCampground, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndUpdate(
        id,
        req.body.campground,
        {
            runValidators: true,
            new: true,
        }
    );
    res.redirect(`/campgrounds/${campgrounds._id}`);
}));

router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));

module.exports = router;