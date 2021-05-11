const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers")
const Campground = require("../models/campground");
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('seedsdb: we  are connected!'))

const sampleTitle = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let index = 0; index < 50; index++) {
        const rand1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            title: `${sampleTitle(descriptors)} ${sampleTitle(places)} `,
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
        })
        await camp.save();

    }
}

seedDB().then(() => mongoose.connection.close());