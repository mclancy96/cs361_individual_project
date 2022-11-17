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

const User = mongoose.model("User", userSchema);
export { User };
