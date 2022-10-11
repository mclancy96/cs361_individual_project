import express, { urlencoded } from "express";
const app = express();
import cors from "cors";
import ejs from "ejs";
import dotenv from "dotenv";
import { getDistricts } from "./controllers/getDistricts.js";

dotenv.config();

const port = process.env.PORT;

app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("./public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

// post route for zip code search
app.post("/search", async (req, res) => {
  // TODO: Integrate with backend?
  // Request representatives
  const zipcode = req.body.zipcode;
  if (!zipcode) {
    console.log("Error with zip");
  }
  let zipString = zipcode.toString();
  let buffer = 5 - zipString.length;
  for (let i = 0; i < buffer; i++) {
    zipString = "0" + zipString;
  }
  //await getDistricts(zipcode);

  // Get results
  const districts = [];
  const reps = [];
  const senators = [];
  // Pass results in res to search results page and render page.

  res.render("search_results", {
    zipcode: zipString,
    districts: districts,
    reps: reps,
    senators: senators,
  });
});

app.listen(port, () => {
  const timeNow = Date.now();
  const dateTime = new Date(timeNow);
  const timeString = dateTime.toISOString();
  console.log(`(${timeString}) Find Your Rep app listening on port ${port}`);
});
