import fetch from "node-fetch";
import axios from "axios";
import * as cheerio from "cheerio";

const searchUrl = process.env.SEARCHURL;

export const getRepData = async (zipcode) => {
  try {
    const response = await fetch(searchUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ zipcode: zipcode }),
    });
    return response.json();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getDistData = async (district) => {
  try {
    const response = await axios.get(
      `https://en.wikipedia.org/wiki/${encodeURIComponent(district)}`
    );
    const html = response.data;
    const $ = cheerio.load(html);
    let mapLink = $("div.switcher-container > div > div > a > img").attr("src");
    if (mapLink == undefined || mapLink == "") {
      mapLink = $("td.infobox-image > a > img").attr("src");
    }

    const headers = [];
    $("table.infobox > tbody > tr > th").each((_idx, el) => {
      const header = $(el).text();
      headers.push(header);
    });
    const rowData = [];
    $("table.infobox > tbody > tr > td").each((_idx, el) => {
      const info = $(el).text();
      rowData.push(info);
    });
    let population = "N/A";
    let income = "N/A";
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].slice(0, 10) == "Population") {
        population = rowData[i];
      }
      if (headers[i] == "Median householdincome") {
        income = rowData[i];
      }
    }
    return {
      map: mapLink,
      population: population,
      income: income,
    };
  } catch (error) {
    console.error("Error:", error);
  }
};
