const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

// res.cloudinary.com/kolpaja/image/upload/v1621517633/YelpCamp/coszw80nfnmu2hej2vw1.jpg

const imageSchema = new Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_300");
});

const campgroundSchema = new Schema({
  title: String,
  price: Number,
  location: String,
  description: String,
  images: [imageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.post("findOneAndDelete", async function (data) {
  if (data) {
    await Review.remove({ _id: { $in: data.reviews } });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
