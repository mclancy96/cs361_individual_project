import { User } from "../models/user.js";

const arrayRemove = (arr, value) => {
  return arr.filter((element) => {
    return element != value;
  });
};

export const addUser = (userName) => {
  const newUser = new User({ name: userName });
  return newUser.save();
};

export const getUser = (id) => {
  return User.findOne({ _id: id });
};

export const addDistrict = async (district, id) => {
  const user = await getUser(id);
  if (!user.districts.includes(district)) {
    user.districts.push(district);
    user.save();
  } else {
    throw "District already exists";
  }
};

export const addRep = async (rep, id) => {
  const user = await getUser(id);
  if (!user.reps.includes(rep)) {
    user.reps.push(rep);
    user.save();
  } else {
    throw "Representative already exists";
  }
};

export const removeDistrict = async (district, id) => {
  const user = await getUser(id);
  if (user.districts.includes(district)) {
    user.districts = arrayRemove(user.districts, district);
    user.save();
  } else {
    throw "District not in favorites";
  }
};

export const removeRep = async (rep, id) => {
  const user = await getUser(id);
  if (user.reps.includes(rep)) {
    user.reps = arrayRemove(user.reps, rep);
    user.save();
  } else {
    throw "Representative not in favorites";
  }
};
