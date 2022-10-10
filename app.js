const express = require("express");
const app = express();
const cors = require("cors");
const ejs = require("ejs");
require("dotenv").config();

const port = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

// post route for zip code search
app.post("/search", (req, res) => {
  // TODO: Integrate with backend?
  // Get results
  // Pass results in res to search results page and render page.
  const zipcode = "98101";
  res.render("search_results", { zipcode: zipcode });
});

app.listen(port, () => {
  const timeNow = Date.now();
  const dateTime = new Date(timeNow);
  const timeString = dateTime.toISOString();
  console.log(`(${timeString}) Find Your Rep app listening on port ${port}`);
});
