import axios from "axios";
const districtUrl =
  "https://compass.greatdata.com/zipcode/congressfragment?zipcode=";

export const getDistricts = (zipcode) => {
  axios
    .get(`${districtUrl}${zipcode}`)
    .then(function (response) {
      // handle success
      console.log(response.data);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
};
