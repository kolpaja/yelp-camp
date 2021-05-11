const express = require("express");
const app = express();
const path = require("path");
const Campground = require("./models/campground")
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('db: we connected!'))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.get("/makecampground", async (req, res) => {
    const camp = new Campground({ title: "bacja mbrapa shpis", description: "cheap camp" })
    await camp.save();
    res.send(camp);
})

app.get("/", (req, res) => {
    res.render("home")
})

app.listen(8080, () => console.log('Listening from port 8080'))