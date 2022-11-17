import dotenv from "dotenv";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

dotenv.config();

mongoose.connect(
  `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBURL}/?retryWrites=true&w=majority`
);

const userSchema = new Schema({
  name: String,
  districts: [],
  reps: [],
});

module.exports = mongoose.model("User", userSchema);
