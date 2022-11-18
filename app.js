import express, { urlencoded } from "express";
const app = express();
import cors from "cors";
import dotenv from "dotenv";
import * as userControllers from "./controllers/user.js";
import { getRepData, getDistData } from "./controllers/getData.js";

dotenv.config();

const port = process.env.PORT;

const userId = "637667dae2a171c6b9e9e1fe"; // user creation and editing not part of this sprint

app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("./public"));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const user = await userControllers.getUser(userId);
  res.render("index", { user: user });
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

  const user = await userControllers.getUser(userId);

  res.render("search_results", {
    zipcode: zipcode,
    district: results.district,
    reps: results.officials.representatives,
    senators: results.officials.senators,
    districtData: districtData,
    user: user,
  });
});

//======================================================
//==================User Routes=========================
//======================================================

app.get("/user/:id", async (req, res) => {
  try {
    const user = await userControllers.getUser(req.params.id);
    res.status(200).render("userProfile", { user: user });
  } catch (error) {
    res.status(400).send(`Error getting user: ${error}`);
    console.log(`Error getting user: ${error}`);
  }
});

app.post("/user/new", async (req, res) => {
  try {
    const { userName } = req.body;
    userControllers.addUser(userName).then(() => {
      res.status(200).send(`New user created: ${userName}`);
      console.log(`New user created: ${userName}`);
    });
  } catch (error) {
    res.status(400).send(`Error adding user: ${error}`);
    console.log(`Error adding user: ${error}`);
  }
});

app.post("/user/:id/reps/", async (req, res) => {
  try {
    const { rep } = req.body;
    if (rep == null || rep == "" || rep.length == 0) {
      throw "Representative's name is empty";
    }
    await userControllers.addRep(rep, req.params.id);
    res.redirect(`/user/${req.params.id}`);
  } catch (error) {
    res.redirect(`/user/${req.params.id}`);
  }
});

app.post("/user/:id/reps/delete", async (req, res) => {
  try {
    const { rep } = req.body;
    if (rep == null || rep == "" || rep.length == 0) {
      throw "Representative's name is empty";
    }
    await userControllers.removeRep(rep, req.params.id);
    res.redirect(`/user/${req.params.id}`);
  } catch (error) {
    res.redirect(`/user/${req.params.id}`);
  }
});

app.post("/user/:id/districts/", async (req, res) => {
  try {
    const { district } = req.body;
    if (district == null || district == "" || district.length == 0) {
      throw "District's name is empty";
    }
    await userControllers.addDistrict(district, req.params.id);
    res.redirect(`/user/${req.params.id}`);
  } catch (error) {
    res.redirect(`/user/${req.params.id}`);
  }
});

app.post("/user/:id/districts/delete", async (req, res) => {
  try {
    const { district } = req.body;
    if (district == null || district == "" || district.length == 0) {
      throw "District's name is empty";
    }
    await userControllers.removeDistrict(district, req.params.id);
    res.redirect(`/user/${req.params.id}`);
  } catch (error) {
    res.redirect(`/user/${req.params.id}`);
  }
});

//======================================================

app.get("*", (req, res) => {
  res.render("error", {
    message: "That page doesn't exist",
  });
});

app.listen(port, () => {
  const timeNow = Date.now();
  const dateTime = new Date(timeNow);
  const timeString = dateTime.toISOString();
  console.log(`(${timeString}) Find Your Rep app listening on port ${port}`);
});
