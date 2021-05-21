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

const opts = { toJSON: { virtuals: true } };
const campgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
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
  },
  opts
);

campgroundSchema.virtual("properties.popUp").get(function () {
  return `
  <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
  <p>${this.description.substring(0, 20)}...</p>
  <div>$ ${this.price}/night</div>

  `;
});

campgroundSchema.post("findOneAndDelete", async function (data) {
  if (data) {
    await Review.remove({ _id: { $in: data.reviews } });
  }
});

module.exports = mongoose.model("Campground", campgroundSchema);
