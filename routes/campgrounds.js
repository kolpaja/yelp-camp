const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilities/wrapAsync");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, isAuthor, validateCamp } = require("../middleware");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
router
  .route("/")
  .get(wrapAsync(campgrounds.index))
  // .post(isLoggedIn, validateCamp, wrapAsync(campgrounds.makeCamp));
  .post(upload.single("image"), (req, res) => {
    res.send(req.body, req.files)
  })

router.get("/new", isLoggedIn, campgrounds.newCampForm);

router
  .route("/:id")
  .get(wrapAsync(campgrounds.showCamp))
  .put(isLoggedIn, isAuthor, validateCamp, wrapAsync(campgrounds.editedCamp))
  .delete(isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCamp));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  wrapAsync(campgrounds.editCampForm)
);

module.exports = router;
