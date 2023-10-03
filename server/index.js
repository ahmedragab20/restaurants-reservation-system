const PORT = 4000;
const BASE_URL = "https://api.foodics.dev/v5/";
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { getQueryParams } = require("./utils");

require("dotenv").config();

const app = express();

app.use(cors());

app.get("/branches", async (req, res) => {
  try {
    const reqURL = req.protocol + "://" + req.get("host") + req.originalUrl;
    const url = reqURL.replace("http://localhost:4000/", BASE_URL);

    const reqBody = getQueryParams(url);
    console.log("URL: ", url);
    console.log("Body: ", reqBody);

    const options = {
      method: "GET",
      url,
      headers: {
        Authorization: `Bearer ${process.env.VUE_APP_API_ACCESS_TOKEN}`,
      },
    };

    await axios
      .request(options)
      .then((response) => {
        res.json(response.data);
      })
      .catch((error) => {
        res.json(error);
      });
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
