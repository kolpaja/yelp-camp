const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsLint = require("ejs-lint");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const mongoose = require("mongoose");
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

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "bacja mbrapa shpis",
    description: "cheap camp",
  });
  await camp.save();
  res.send(camp);
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const campgrounds = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campgrounds });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campgrounds = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campgrounds });
});

app.put("/campgrounds/:id", async (req, res) => {
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
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campgrounds = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.get("/", (req, res) => {
  res.render("campgrounds/home");
});

app.listen(8080, () => console.log("Listening from port 8080"));
