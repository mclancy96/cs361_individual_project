const User = require("../models/user");

const arrayRemove = (arr, value) => {
  return arr.filter((element) => {
    return element != value;
  });
};

export const addUser = (userName) => {
  const newUser = new User({ name: userName });
  newUser.save();
};

export const getUser = (id) => {
  return User.find({ _id: id });
};

export const addDistrict = async (district, id) => {
  try {
    const user = await getUser(id);
    user.districts.push(district);
    user.save();
  } catch (error) {
    console.log("Error adding district");
  }
};

export const addRep = async (rep, id) => {
  try {
    const user = await getUser(id);
    user.reps.push(rep);
    user.save();
  } catch (error) {
    console.log("Error adding representative");
  }
};

export const removeDistrict = async (district, id) => {
  try {
    const user = await getUser(id);
    user.districts = arrayRemove(user.districts, district);
    user.save();
  } catch (error) {
    console.log("Error removing district");
  }
};

export const removeRep = async (rep, id) => {
  try {
    const user = await getUser(id);
    user.reps = arrayRemove(user.reps, rep);
    user.save();
  } catch (error) {
    console.log("Error removing representative");
  }
};
