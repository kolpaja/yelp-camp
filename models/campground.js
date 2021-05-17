const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const campgroundSchema = new Schema({
    title: String,
    price: Number,
    location: String,
    description: String,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId, ref: "Review"
        }
    ]
});

campgroundSchema.post("findOneAndDelete", async function (data) {
    if (data) {
        await Review.remove({ _id: { $in: data.reviews } })
    }
})

module.exports = mongoose.model("Campground", campgroundSchema);