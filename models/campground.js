const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    price: String,
    location: String,
    description: String,
});

module.exports = mongoose.model("Campground", campgroundSchema);