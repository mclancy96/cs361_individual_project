const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const ejs = require("ejs");
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

// post route for zip code search
app.post("/search", (req, res) => {
  // TODO: Integrate with backend?
  // Get results
  // Pass results in res to search results page and render page.
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
