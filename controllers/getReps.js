const axios = require("axios");
const repUrl = "https://whoismyrepresentative.com/getall_mems.php?zip=";

const getReps = (zipcode) => {
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
