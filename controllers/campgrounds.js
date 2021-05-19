const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.newCampForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.makeCamp = async (req, res) => {
  // if (!req.body.campground) throw new ExpressError("Invalid campground data", 400)
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "You successfully made a new Campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCamp = async (req, res) => {
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
};

module.exports.editCampForm = async (req, res) => {
  const campgrounds = await Campground.findById(req.params.id);
  if (!campgrounds) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campgrounds });
};

module.exports.editedCamp = async (req, res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findByIdAndUpdate(
    id,
    req.body.campground,
    { runValidators: true, new: true }
  );
  req.flash("success", "Successfully updated your campground!");
  res.redirect(`/campgrounds/${campgrounds._id}`);
};

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Your campground was successfully  deleted");
  res.redirect("/campgrounds");
};
