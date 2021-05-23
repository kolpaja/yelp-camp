if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError");
const flash = require("connect-flash");
const mongoSanitize = require("express-mongo-sanitize");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const User = require("./models/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require('express-session');

const MongoDBStore = require("connect-mongo")

// so we have the db url form mongo atlas or the local mongodb
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const mongoose = require("mongoose");
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("db: we connected!"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const store = new MongoDBStore({
  mongoUrl: dbUrl,
  secret: "keyboard cat we've to store it better",
  touchAfter: 24 * 60 * 60,

})

store.on("error", e => {
  console.log("Session Store error", e);
})

const secret = process.env.SECRET || "keyboard cat we've to store it better";
const sessionConfig = {
  store,
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //has to be below our app.use(session(...))
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //helps in session keep user logged in
passport.deserializeUser(User.deserializeUser()); //helps in session //remove user from logged in

app.use((req, res, next) => {
  if (!["/login"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.loggedInUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("campgrounds/home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no something went wrong!";
  res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Serving on port: ${port}`));
