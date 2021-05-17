const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsLint = require("ejs-lint");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const Review = require("./models/review")
const { campgroundSchemaJoi, reviewSchemaJoi } = require("./validateSchemas.js")
const wrapAsync = require("./utilities/wrapAsync")
const ExpressError = require("./utilities/ExpressError")
const mongoose = require("mongoose");
const review = require("./models/review");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("db: we connected!"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchemaJoi.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else return next()
}

const validateReview = (req, res, next) => {
  const { error } = reviewSchemaJoi.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(",")
    throw new ExpressError(msg, 400)
  } else return next()
}

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "bacja mbrapa shpis",
    description: "cheap camp",
  });
  await camp.save();
  res.send(camp);
});

app.get("/campgrounds", wrapAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", validateCampground, wrapAsync(async (req, res) => {
  // if (!req.body.campground) throw new ExpressError("Invalid campground data", 400)
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.get("/campgrounds/:id", wrapAsync(async (req, res) => {
  const campgrounds = await Campground.findById(req.params.id).populate("reviews")
  res.render("campgrounds/show", { campgrounds });
}));

app.get("/campgrounds/:id/edit", wrapAsync(async (req, res) => {
  const campgrounds = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campgrounds });
}));

app.put("/campgrounds/:id", validateCampground, wrapAsync(async (req, res) => {
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

app.delete("/campgrounds/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

app.post("/campgrounds/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${id}`)
}))

app.get("/", (req, res) => {
  res.render("home");
});


app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found", 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no something went wrong!"
  res.status(statusCode).render("error", { err })
})
app.listen(8080, () => console.log("Listening from port 8080"));
