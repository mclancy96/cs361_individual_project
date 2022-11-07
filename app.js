import express, { urlencoded } from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import { getRepData, getDistData } from "./controllers/getData.js";

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
  // Request representatives
  let zipcode = req.body.zipcode;
  if (!zipcode) {
    console.log("Error with zip");
    res.render("error", {
      message:
        "That zipcode resulted in an error. Please try entering your full address.",
    });
    return;
  }
  if (zipcode.length < 5) {
    let zipString = zipcode.toString();
    let buffer = 5 - zipString.length;
    for (let i = 0; i < buffer; i++) {
      zipString = "0" + zipString;
    }
    zipcode = zipString;
  }

  let results;
  try {
    results = await getRepData(zipcode);
  } catch (error) {
    res.render("error", {
      message:
        "That zipcode resulted in an error. Please try entering your full address.",
    });
    return;
  }

  if (!results || Object.keys(results).length === 0) {
    res.render("error", {
      message:
        "We aren't able to find information for that zip code. Please try entering your full address.",
    });
    return;
  }

  if (results.officials == {} || results.officials.representatives == []) {
    res.render("error", {
      message:
        "There may be multiple districts for that zip code. Please try entering your full address.",
    });
    return;
  }

  const { input } = results;

  if (input) {
    zipcode = input["zip"];
  }

  const districtData = await getDistData(results.district);

  res.render("search_results", {
    zipcode: zipcode,
    district: results.district,
    reps: results.officials.representatives,
    senators: results.officials.senators,
    districtData: districtData,
  });
});

app.listen(port, () => {
  const timeNow = Date.now();
  const dateTime = new Date(timeNow);
  const timeString = dateTime.toISOString();
  console.log(`(${timeString}) Find Your Rep app listening on port ${port}`);
});
