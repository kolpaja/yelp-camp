const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => console.log("seedsdb: we  are connected!"));

const sampleTitle = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let index = 0; index < 5; index++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const randPrice = Math.floor(Math.random() * 20 + 1) + 10;
    const camp = new Campground({
      author: "60a4d183124f5417209525dc",
      title: `${sampleTitle(descriptors)} ${sampleTitle(places)} `,
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      images: [
        {
          url: "https://res.cloudinary.com/kolpaja/image/upload/v1621504911/YelpCamp/caowthttdkcjc5nvppo4.png",
          filename: "YelpCamp/caowthttdkcjc5nvppo4",
        },
        {
          url: "https://res.cloudinary.com/kolpaja/image/upload/v1621504912/YelpCamp/y9ltmrlaomkx3hw2ppoo.png",
          filename: "YelpCamp/y9ltmrlaomkx3hw2ppoo",
        },
      ],
      price: randPrice,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam quisquam commodi libero corrupti alias doloribus sed ipsa sequi nisi facere. Laboriosam commodi illo sapiente dolorem quia quas officia aliquid expedita!",
    });
    await camp.save();
  }
};

seedDB().then(() => mongoose.connection.close());
